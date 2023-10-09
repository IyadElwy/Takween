from tortoise.models import Model
from tortoise import fields
from enums.annotation_type import AnnotationType


class Project(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=20)
    description = fields.CharField(max_length=1000, null=True)
    author = fields.CharField(max_length=20, null=True)
    dataFileName = fields.CharField(max_length=400, null=True)
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
        return f"Project: {self.project.title} | Job: {self.title}"
