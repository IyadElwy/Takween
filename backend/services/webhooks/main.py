import os

import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from router import router

from errors.http import UnAuthenticatedError

load_dotenv()

web_hook_secret = os.getenv('WEB_HOOK_SECRET')


class Config:
    def __init__(self) -> None:
        self.db_conn = None


config = Config()

conn = psycopg2.connect(
    dbname=os.getenv('POSTGRES_DB'),
    user=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD'),
    host=os.getenv('PGHOST'),
    port=os.getenv('PGPORT'),
)
config.db_conn = conn

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
    auth_header = request.headers.get('Authorization')
    if auth_header:
        secret = auth_header.split('Bearer ')[1]
        if secret != web_hook_secret:
            return UnAuthenticatedError()
        response = await call_next(request)
        return response
    return UnAuthenticatedError()


@app.middleware('http')
async def config_middleware(request: Request, call_next):
    request.state.config = config
    response = await call_next(request)
    return response


app.include_router(router)
