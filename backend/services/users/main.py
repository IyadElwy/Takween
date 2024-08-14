import os

import psycopg2
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from router import router

load_dotenv()


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
async def config_middleware(request: Request, call_next):
    request.state.config = config
    response = await call_next(request)
    return response


app.include_router(router)
