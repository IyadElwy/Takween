from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from models.models import Project
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv
import json
import uuid

load_dotenv()
username = os.getenv("MONGODB_USERNAME")
password = os.getenv("MONGODB_PASSWORD")
CONNECTION_URI = os.getenv("MONGODB_BASE_URI").replace(  # type: ignore
    "{MONGODB_USERNAME}", username).replace("{MONGODB_PASSWORD}", password)  # type: ignore

mongodb = pymongo.MongoClient(CONNECTION_URI)
mongodb = mongodb["annotations"]

router = APIRouter()


@router.get("/projects/{projectId}/jobs/{jobId}/annotations")
async def get_job_annotations(projectId, jobId, itemsPerPage: int, page: int,):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore

        starting_line = page * itemsPerPage

        collection_name = job.annotation_collection_name
        collection = mongodb[collection_name]
        data = collection.find().sort([('_id', pymongo.ASCENDING)]).skip(
            starting_line).limit(itemsPerPage)

        # number of finished annotations
        finished_annotations = collection.count_documents(
            {"annotations": {"$exists": True, "$not": {"$size": 0}}}
        )
        finished_annotations_by_user = collection.count_documents(
            {"annotations": {"$exists": True, "$not": {"$size": 0}}, "annotations.user": "admin"})

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
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
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


@router.get("/projects/{projectId}/jobs/{jobId}/annotations/{_id}")
async def get_single_annotation(projectId, jobId, _id: int):
    try:
        project = await Project.get(id=projectId)
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore
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
        job = await project.Jobs.filter(id=jobId).first()  # type: ignore

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
