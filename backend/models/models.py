from tortoise.models import Model
from tortoise import fields
from enum import Enum


class AnnotationTypes(Enum):
    TEXT_CLASSIFICATION = 'Text Classification'
    NAMED_ENTITY_RECOGNITION = 'Named Entity Recognition'
    PART_OF_SPEECH_TAGS = 'Part Of Speech Tags'
    TABULAR = 'Tabular'


class Project(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=20)
    description = fields.CharField(max_length=1000, null=True)
    author = fields.CharField(max_length=20, null=True)
    dataFileName = fields.CharField(max_length=400, null=True)

    def __str__(self) -> str:
        return self.title


class Job(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    project = fields.ForeignKeyField('models.Project', related_name='Jobs')
    annotation_type = fields.CharEnumField(AnnotationTypes, max_length=100)

    def __str__(self) -> str:
        return f"Project: {self.project.title} | Job: {self.title}"
