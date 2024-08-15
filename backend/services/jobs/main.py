import os

import jwt
import psycopg2
from dotenv import load_dotenv
from errors import UnAuthenticatedError
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from router import router

load_dotenv()

jwt_secret = os.getenv('JWT_SECRET')


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

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.middleware('http')
async def authenticate_user(request: Request, call_next):
    if request.method == 'OPTIONS':
        response = JSONResponse(content={}, status_code=200)
        response = await call_next(request)
        return response
    else:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split('Bearer ')[1]
            decoded_token = jwt.decode(
                token, key=jwt_secret, algorithms=['HS256']
            )
            request.state.bearer_token = token
            request.state.user_id = decoded_token['user_id']
            response = await call_next(request)
            return response
        else:
            return UnAuthenticatedError()


@app.middleware('http')
async def config_middleware(request: Request, call_next):
    request.state.config = config
    response = await call_next(request)
    return response


app.include_router(router)
