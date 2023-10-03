from fastapi import FastAPI, HTTPException, Request, Path
from tortoise.contrib.fastapi import register_tortoise
from models.models import Project
from fastapi.middleware.cors import CORSMiddleware

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
    generate_schemas=False,
    add_exception_handlers=True,
)


@app.get("/projects")
async def get_all_projects():
    try:
        all_projects = await Project.all()
        return all_projects
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/projects")
async def create_project(request: Request):
    try:
        data = await request.json()
        await Project.create(
            author="admin",
            title=data.get('title'),
            description=data.get('description'),
            dataFileName=data.get('dataFileName'),)
        return {"message": "Item created successfully", "data": data}
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
