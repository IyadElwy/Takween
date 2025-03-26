class UniqueFieldException(Exception):
    def __init__(self, field_in_question) -> None:
        super().__init__(f'Unique constraint for field "{field_in_question}" violated')


class UserNotFoundException(Exception):
    def __init__(self, message='User not found') -> None:
        super().__init__(message)


class ValidationException(Exception):
    def __init__(self, validation_error) -> None:
        self.validation_error = validation_error
        super().__init__(validation_error)


class ProjectNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('Project not found')


class FileConversionException(Exception):
    def __init__(self) -> None:
        super().__init__('Error while converting file to json')


class UnAuthorizedException(Exception):
    def __init__(self) -> None:
        super().__init__('User not authorized')


class DataSourceNotFoundException(Exception):
    def __init__(self):
        super().__init__('Datasource not found')


class InvalidFilterException(Exception):
    def __init__(self, message) -> None:
        self.message = message
        super().__init__()


class JobNotFoundException(Exception):
    def __init__(self) -> None:
        super().__init__('Project not found')
