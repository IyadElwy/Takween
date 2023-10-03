from fastapi import FastAPI, HTTPException, Request, File, UploadFile
from tortoise.contrib.fastapi import register_tortoise
from models.models import Project
from fastapi.middleware.cors import CORSMiddleware
from asyncio import sleep
from slugify import slugify
import pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_tortoise(
    app,
    db_url='sqlite://db.sqlite3',
    modules={'models': ['models.models']},
    generate_schemas=True,
    add_exception_handlers=True,
)


@app.get("/projects")
async def get_all_projects():
    try:
        all_projects = await Project.all()
        await sleep(2)
        return all_projects
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/projects")
async def create_project(request: Request):
    try:
        data = await request.json()
        createdItem = await Project.create(
            author="admin",
            title=data.get('title'),
            description=data.get('description'),
            dataFileName=data.get('dataFileName'),)
        return {"message": "Item created successfully", "data": createdItem}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/projects/{id}")
async def get_project(id):
    try:
        data = await Project.get(id=id)
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Item not found")


@app.put("/projects/{id}")
async def update_project(id, request: Request):
    try:
        data = await Project.get(id=id)
        updated_data = await request.json()

        for key, value in updated_data.items():
            setattr(data, key, value)

        await data.save()
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Item not found")


@app.post("/projects/upload-file/{id}")
async def upload_file(id, file: UploadFile):
    try:
        data = await Project.get(id=id)
        file_name = f'{id}-{file.filename.replace(" ", "-").replace(".csv", "")}'

        with open(f"data/{file_name}.csv", "wb") as f:
            f.write(file.file.read())

        setattr(data, 'dataFileName', file_name)
        await data.save()

        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail="Item not found")


def check_dtype(inp):
    if inp == 'object':
        return "string"
    if inp == 'int64':
        return 'int'
    if inp == 'float64':
        return 'float'


@app.get("/files/{file_name}")
async def upload_file(file_name):
    try:
        df = pd.read_csv(f'data/{file_name}.csv')
        columns = zip(list(df.dtypes.index), [
                      check_dtype(x) for x in list(df.dtypes.values)])

        return {
            "columns": columns,
            "data": df.values.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail="Item not found")
