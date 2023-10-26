from fastapi import APIRouter
from fastapi import HTTPException, Request
from models.models import Project, User
from tortoise.expressions import Q

router = APIRouter()


@router.get("/projects")
async def get_all_projects(request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)

        projects = await Project.filter(assigned_users=user)

        final_projects = []
        for project in projects:
            curr_proj = dict(project)
            assigned_users = await projects[0].assigned_users.all()
            final_projects.append(
                {**curr_proj, "assigned_users": assigned_users})

        return final_projects
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/projects")
async def create_project(request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)
        user.can_create_jobs = True
        user.can_add_data = True
        await user.save()

        project_data = await request.json()

        created_project = await Project.create(
            created_by=user,
            title=project_data.get('title'),
            description=project_data.get('description'),
        )
        await created_project.assigned_users.add(user)

        return {"message": "Item created successfully", "data": {
            "project": created_project,
        }}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/projects/{id}")
async def get_project_by_id(id, request: Request):
    try:
        user_id = request.state.user_id
        user = await User.get(id=user_id)

        project = await Project.filter(assigned_users=user).filter(id=id).first()
        if not project:
            raise Exception("Project not found")

        return {'project': project}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/projects/{id}")
async def delete_project(id, request: Request):
    try:
        await Project.filter(id=id).delete()
        return {}
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


@router.get("/projects/{id}/users")
async def get_all_users(id, request: Request):
    try:
        project = await Project.get(id=id)
        assigned_users = [user.id for user in await project.assigned_users]
        users = [{**dict(user),
                  'project_member': user.id in assigned_users
                  } for user in await User.all()]

        return users
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
