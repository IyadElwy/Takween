from fastapi import HTTPException
from fastapi.responses import JSONResponse


def UnAuthenticatedError():
    return JSONResponse({'detail': 'User not authenticated'}, status_code=403)


class ValidationException(Exception):
    def __init__(self, validation_error) -> None:
        self.validation_error = validation_error
        super().__init__(validation_error)


class UserNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('User not found')


class ProjectNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('Project not found')


class FileConversionException(Exception):
    def __init__(self) -> None:
        super().__init__('Error while converting file to json')


class UnAuthorizedException(Exception):
    def __init__(self) -> None:
        super().__init__('User not authorized')


class ProjectNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'Project not found')


class UserNotFoundError(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, 'User not found')


class ValidationError(HTTPException):
    def __init__(self, message) -> None:
        super().__init__(403, message)


class FileConversionError(HTTPException):
    def __init__(self) -> None:
        super().__init__(403, 'Error while converting file to json')


class UnAuthorizedError(HTTPException):
    def __init__(self) -> None:
        super().__init__(401, 'User not authorized')
