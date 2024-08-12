from fastapi.exceptions import HTTPException


class UniqueFieldException(Exception):
    def __init__(self, field_in_question) -> None:
        super().__init__(
            f'Unique constraint for field "{field_in_question}" violated')


class UserNotFoundException(Exception):
    def __init__(self, message="User not found") -> None:
        super().__init__(message)


class IncorrectLoginInfoException(HTTPException):
    def __init__(self) -> None:
        super().__init__(401, "Wrong log-in info")


class ValidationError(HTTPException):
    def __init__(self, validation_error) -> None:
        super().__init__(403, validation_error)
