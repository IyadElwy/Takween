from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from fastapi.middleware.cors import CORSMiddleware
from routers import data_sources, jobs, projects, annotations, authentication, users, data_collection, data_processing
from middleware.authentication import authenticate_user

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.middleware('http')(authenticate_user)

register_tortoise(
    app,
    db_url='sqlite://db.sqlite3',
    modules={'models': ['models.models']},
    generate_schemas=True,
    add_exception_handlers=True,
)

app.include_router(authentication.router)
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(data_collection.router)
app.include_router(data_processing.router)
app.include_router(jobs.router)
app.include_router(data_sources.router)
app.include_router(annotations.router)
