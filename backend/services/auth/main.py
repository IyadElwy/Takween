import os
from fastapi import FastAPI, Request
from router import router
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from dotenv import load_dotenv


load_dotenv()


class Config:
    def __init__(self) -> None:
        self.db_conn = None
        self.jwt_salt = None
        self.jwt_secret = None


config = Config()


DB_URL = URL.create(
    drivername='postgresql+psycopg2',
    host=os.getenv('PGHOST'),
    port=os.getenv('PGPORT'),
    username=os.getenv('POSTGRES_USER'),
    password=os.getenv('POSTGRES_PASSWORD'),
    database=os.getenv('POSTGRES_DB'))

engine = create_engine(
    DB_URL.render_as_string(hide_password=False), echo=True)
conn = engine.connect()
config.db_conn = conn
config.jwt_salt = os.getenv("SALT")
config.jwt_secret = os.getenv("JWT_SECRET")


app = FastAPI()


@app.middleware("http")
async def config_middleware(request: Request, call_next):
    request.state.config = config
    response = await call_next(request)
    return response

app.include_router(router)
