from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from models.models import Project
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv
import json
import uuid
import copy
from deepdiff import DeepDiff


load_dotenv()
username = os.getenv("MONGODB_USERNAME")
password = os.getenv("MONGODB_PASSWORD")
CONNECTION_URI = os.getenv("MONGODB_BASE_URI").replace(  # type: ignore
    "{MONGODB_USERNAME}", username).replace("{MONGODB_PASSWORD}", password)  # type: ignore

mongodb = pymongo.MongoClient(CONNECTION_URI)
mongodb = mongodb["annotations"]

router = APIRouter()


@router.get("/projects/{projectId}/jobs/{jobId}/annotations")
async def get_job_annotations(projectId, jobId, itemsPerPage: int, page: int, onlyShowUnanotatedData: bool):
    try:
        project = await Project.get(id=projectId)
        job = await project.get_jobs(id=jobId)  # type: ignore
        job = job[0]
        starting_line = page * itemsPerPage

        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        custom_filter = {
            "$or": [
                {"annotations": {"$exists": True, "$eq": []}},
                {"annotations": {"$exists": False}}
            ]
        } if onlyShowUnanotatedData else {}

        data = collection.find(custom_filter).sort([('_id', pymongo.ASCENDING)]).skip(
            starting_line).limit(itemsPerPage)

        # number of finished annotations
        finished_annotations = collection.count_documents(
            {"annotations": {"$exists": True, "$not": {"$size": 0}}}
        )
        finished_annotations_by_user = collection.count_documents(
            {"annotations": {"$exists": True, "$not": {"$size": 0}}, "annotations.user": "admin"})

        data = list(data)
        for item in data:
            fake_item = copy.deepcopy(item)
            annotations = fake_item['annotations']
            for annotation in annotations:
                del annotation['user']

            are_equal = all(
                d == annotations[0] for d in annotations)

            item['conflict'] = not are_equal

        # line-count
        totalRowCount = 0
        if page == 0:
            totalRowCount = collection.count_documents({})

        return {
            "data": list(data),
            "totalRowCount": totalRowCount,
            "finishedAnnotations": finished_annotations,
            "finishedAnnotationsByUser": finished_annotations_by_user
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{projectId}/jobs/{jobId}/annotations/export")
async def export_data(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.get_jobs(id=jobId)  # type: ignore
        job = job[0]
        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        data_query = collection.find()

        random_id = uuid.uuid4()
        temp_file_path = f'annotations/temp/{collection_name}-{random_id}-data.ndjson'
        with open(temp_file_path, 'a+') as temp:
            for item in data_query:
                temp.write(json.dumps(dict(item)) + '\n')

        return FileResponse(temp_file_path, headers={"Content-Disposition": f"attachment; filename={collection_name}-data.ndjson"})

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{projectId}/jobs/{jobId}/annotations/merge/export")
async def merge_and_export_data(projectId, jobId):
    try:
        project = await Project.get(id=projectId)
        job = await project.get_jobs(id=jobId)  # type: ignore
        job = job[0]

        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        data_query = collection.find()

        random_id = uuid.uuid4()
        temp_file_path = f'annotations/temp/{collection_name}-{random_id}-data.ndjson'
        with open(temp_file_path, 'a+') as temp:

            for item in data_query:
                fake_item = copy.deepcopy(item)
                annotations = fake_item['annotations']
                for annotation in annotations:
                    del annotation['user']
                are_equal = all(
                    d == annotations[0] for d in annotations)

                users = [curr['user'] for curr in item['annotations']]
                if are_equal:
                    item['annotations'] = {"users": users, **annotations[0]}
                else:
                    fake_item = copy.deepcopy(item)
                    for curr_ann in fake_item['annotations']:
                        curr_user = curr_ann['user']
                        if curr_user['id'] == str(job.assigned_reviewer_id):
                            item['annotations'] = {
                                "user": curr_user, **curr_ann}
                            break

                temp.write(json.dumps(item) + '\n')

        return FileResponse(temp_file_path, headers={"Content-Disposition": f"attachment; filename={collection_name}-data.ndjson"})

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{projectId}/jobs/{jobId}/annotations/{_id}")
async def get_single_annotation(projectId, jobId, _id: int):
    try:
        project = await Project.get(id=projectId)
        job = await project.get_jobs(id=jobId)  # type: ignore
        job = job[0]
        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        data = collection.find_one({'_id': _id})

        return data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects/{projectId}/jobs/{jobId}/annotations")
async def create_annotation(projectId, jobId, data: Request):
    try:
        annotation_data = await data.json()

        project = await Project.get(id=projectId)
        job = await project.get_jobs(id=jobId)  # type: ignore
        job = job[0]

        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]

        update_query = {
            '$set': {
                'annotations': annotation_data['annotations']
            }
        }

        result = collection.find_one_and_update(
            {'_id': annotation_data['_id']},
            update_query,
            return_document=pymongo.ReturnDocument.AFTER)

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
