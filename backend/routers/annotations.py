from fastapi import APIRouter, HTTPException, Request
from models.models import Project
import pandas as pd
import pymongo
import os
from dotenv import load_dotenv


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

        # line-count
        totalRowCount = 0
        if page == 0:
            totalRowCount = collection.count_documents({})

        return {
            "data": list(data),
            "totalRowCount": totalRowCount
        }

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
