from tortoise.models import Model
from tortoise import fields
from enums.annotation_type import AnnotationType
from enums.file_types import FileType


class Project(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=20)
    description = fields.CharField(max_length=1000, null=True)
    author = fields.CharField(max_length=20)
    created_at = fields.DatetimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class Job(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    project = fields.ForeignKeyField('models.Project', related_name='Jobs')
    annotation_type = fields.CharEnumField(AnnotationType, max_length=100)
    created_at = fields.DatetimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.title}"


class FileDataSource(Model):
    id = fields.UUIDField(pk=True)
    file_name = fields.CharField(max_length=300)
    file_type = fields.CharEnumField(FileType, max_length=20)
    project = fields.ForeignKeyField(
        'models.Project', related_name='data_sources')
    jobs = fields.ManyToManyField(
        'models.Job', related_name='file_data_sources')
    location = fields.CharField(max_length=500)
    created_at = fields.DatetimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.location}"
