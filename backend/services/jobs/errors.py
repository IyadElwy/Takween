from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse


class ValidationException(Exception):
    def __init__(self, validation_error) -> None:
        self.validation_error = validation_error
        super().__init__(validation_error)


class InvalidFilterException(Exception):
    def __init__(self, message) -> None:
        self.message = message
        super().__init__()


class UserNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('User not found')


class ProjectNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('Project not found')


class JobNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('Project not found')


class UnAuthorizedException(Exception):
    def __init__(self) -> None:
        super().__init__('User not authorized')


def UnAuthenticatedError():
    return JSONResponse({'detail': 'User not authenticated'}, status_code=403)


class UnAuthorizedError(HTTPException):
    def __init__(self) -> None:
        super().__init__(401, 'User not authorized')


class ProjectNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'Project not found')


class JobNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'Job not found')


class ValidationError(HTTPException):
    def __init__(self, message) -> None:
        super().__init__(403, message)


class UserNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'User not found')


class InvalidSearchError(HTTPException):
    def __init__(self, message) -> None:
        super().__init__(400, message)