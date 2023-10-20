from fastapi import APIRouter
from fastapi import HTTPException, Request
from models.models import Project, User


router = APIRouter()


@router.get("/projects")
async def get_all_projects(request: Request):
    try:
        all_projects = await Project.all()
        return all_projects
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects")
async def create_project(request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)
        project_data = await request.json()

        created_project = await Project.create(
            created_by=user,
            title=project_data.get('title'),
            description=project_data.get('description'))

        return {"message": "Item created successfully", "data": {
            "project": created_project,
        }}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{id}")
async def get_project_by_id(id):
    try:
        project = await Project.get(id=id)
        return {'project': project}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/projects/{id}")
async def update_project(id, request: Request):
    try:
        data = await Project.get(id=id)
        updated_data = await request.json()

        for key, value in updated_data.items():
            setattr(data, key, value)

        await data.save()
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
