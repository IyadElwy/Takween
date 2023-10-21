from fastapi import APIRouter
from fastapi import HTTPException, Request
from models.models import User, Project

router = APIRouter()


@router.patch("/users/{id}")
async def update_user_fields(id, request: Request):
    try:
        body = await request.json()
        user = await User.get(id=id)

        project_member = body.get('isMember')
        add_data = body.get('addData')
        create_jobs = body.get('createJobs')
        isAnnotator = body.get('isAnnotator')
        isReviewer = body.get('isReviewer')

        if project_member is not None:
            project_id = body['projectId']
            project = await Project.get(id=project_id)
            if project_member:
                await project.assigned_users.add(user)
            else:
                await project.assigned_users.remove(user)
                user.can_add_data = False
                user.can_create_jobs = False

        if add_data is not None:
            user.can_add_data = add_data

        if create_jobs is not None:
            user.can_create_jobs = create_jobs

        if isAnnotator is not None:
            project = await Project.get(id=body['projectId'])
            job = await project.Jobs.filter(id=body['jobId']).first()  # noqa: E501 # type: ignore
            if isAnnotator:
                await job.assigned_annotators.add(user)
            else:
                await job.assigned_annotators.remove(user)

            await job.save()

        if isReviewer is not None:
            project = await Project.get(id=body['projectId'])
            job = await project.Jobs.filter(id=body['jobId']).first()  # noqa: E501 # type: ignore
            if isReviewer:
                job.assigned_reviewer = user  # type: ignore
            else:
                job.assigned_reviewer = None  # type: ignore

            await job.save()

        await user.save()

        return user
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
