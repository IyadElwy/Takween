from fastapi import HTTPException
from fastapi.responses import JSONResponse


class UserWithEmailAlreadyExistsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(409, 'user with this email already exists')


class IncorrectLoginInfoError(HTTPException):
    def __init__(self) -> None:
        super().__init__(401, 'Wrong log-in info')


class ValidationError(HTTPException):
    def __init__(self, message) -> None:
        super().__init__(400, message)


def UnAuthenticatedError():
    return JSONResponse({'detail': 'User not authenticated'}, status_code=403)


class ProjectNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'Project not found')


class UserNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'User not found')


class FileConversionError(HTTPException):
    def __init__(self) -> None:
        super().__init__(403, 'Error while converting file to json')


class UnAuthorizedError(HTTPException):
    def __init__(self) -> None:
        super().__init__(401, 'User not authorized')


class DataSourceNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(404, 'Datasource not found')


class JobNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'Job not found')


class InvalidSearchError(HTTPException):
    def __init__(self, message) -> None:
        super().__init__(400, message)
