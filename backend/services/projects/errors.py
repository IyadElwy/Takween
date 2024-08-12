from typing import Any, Dict
from typing_extensions import Annotated, Doc
from fastapi.exceptions import HTTPException


class ProjectNotFoundException(HTTPException):
    def __init__(self) -> None:
        super().__init__(404, "Project not found")
