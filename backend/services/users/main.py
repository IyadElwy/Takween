import os
from fastapi import FastAPI, Request
from router import router
from sqlalchemy import create_engine
from dotenv import load_dotenv


load_dotenv()


class Config:
    def __init__(self) -> None:
        self.db_conn = None


config = Config()

engine = create_engine(
    "sqlite+pysqlite:///../../database.sqlite", echo=True)
conn = engine.connect()
config.db_conn = conn


app = FastAPI()


@app.middleware("http")
async def config_middleware(request: Request, call_next):
    request.state.config = config
    response = await call_next(request)
    return response

app.include_router(router)
