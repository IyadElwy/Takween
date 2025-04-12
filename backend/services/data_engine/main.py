import os

import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from minio import Minio
from pymongo import MongoClient
from router import router

load_dotenv()

jwt_secret = os.getenv('JWT_SECRET')


class Config:
    def __init__(self) -> None:
        self.db_conn = None
        self.mongodb_client = None
        self.minio_client = None


config = Config()

conn = psycopg2.connect(
    dbname=os.getenv('POSTGRES_DB'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD'),
    host=os.getenv('PGHOST'),
    port=os.getenv('PGPORT'),
)
config.db_conn = conn

username = os.getenv('MONGODB_USERNAME')
password = os.getenv('MONGODB_PASSWORD')
CONNECTION_URI = (
    os.getenv('MONGODB_BASE_URI').replace('{MONGODB_USERNAME}', username).replace('{MONGODB_PASSWORD}', password)
)
mongodb_client = MongoClient(CONNECTION_URI)
config.mongodb_client = mongodb_client


minio_access_key = os.getenv('MINIO_ACCESS_KEY')
minio_secret_key = os.getenv('MINIO_SECRET_KEY')
# TODO: REMOVE secure=False and create TLS con
# TODO: ADD dynamic hosts in env file
minio_client = Minio('minio:9000', secure=False, access_key=minio_access_key, secret_key=minio_secret_key)
config.minio_client = minio_client

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.middleware('http')
async def authenticate_service(request: Request, call_next):
    if request.method == 'OPTIONS':
        response = JSONResponse(content={}, status_code=200)
        response = await call_next(request)
        return response
    return await call_next(request)
    # auth_header = request.headers.get('Authorization')
    # if auth_header:
    #     secret = auth_header.split('Bearer ')[1]
    #     if secret != web_hook_secret:
    #         return UnAuthenticatedError()
    # return UnAuthenticatedError()


@app.middleware('http')
async def config_middleware(request: Request, call_next):
    request.state.config = config
    return await call_next(request)


app.include_router(router)
