from tortoise.models import Model
from tortoise import fields
from enums.file_types import FileType
from tortoise.queryset import QuerySet
from typing import List, Union
from tortoise.expressions import Q


class User(Model):
    id = fields.UUIDField(pk=True)
    first_name = fields.CharField(max_length=100)
    last_name = fields.CharField(max_length=100)
    email = fields.CharField(max_length=100, unique=True)
    password = fields.CharField(max_length=1000)
    can_create_jobs = fields.BooleanField(default=False)
    can_add_data = fields.BooleanField(default=False)

    def __str__(self) -> str:
        return f'{self.email}'


class Project(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    description = fields.CharField(max_length=2000, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    created_by = fields.ForeignKeyField(
        'models.User', related_name='created_projects'
    )
    assigned_users = fields.ManyToManyField(
        'models.User', related_name='assigned_users')

    def __str__(self) -> str:
        return self.title

    async def get_jobs(self, *args, **kwargs):
        text_classification_jobs = await TextClassificationJob.filter(
            project_id=self.id).filter(*args).filter(**kwargs)
        pos_jobs = await PartOfSpeechJob.filter(project_id=self.id).filter(*args).filter(**kwargs)
        ner_jobs = await NamedEntityRecognitionJob.filter(project_id=self.id).filter(*args).filter(**kwargs)
        return text_classification_jobs + pos_jobs + ner_jobs

    async def delete_job(self, id):
        await TextClassificationJob.filter(
            project_id=self.id).filter(id=id).delete()
        await PartOfSpeechJob.filter(project_id=self.id).filter(id=id).delete()
        await NamedEntityRecognitionJob.filter(project_id=self.id).filter(id=id).delete()


class FileDataSource(Model):
    id = fields.UUIDField(pk=True)
    file_name = fields.CharField(max_length=300)
    file_type = fields.CharEnumField(FileType, max_length=20)
    size = fields.IntField()
    project = fields.ForeignKeyField(
        'models.Project', related_name='file_data_sources')
    location = fields.CharField(max_length=500)
    created_at = fields.DatetimeField(auto_now=True)
    created_by = fields.ForeignKeyField(
        'models.User', related_name='created_file_data_sources'
    )

    def __str__(self) -> str:
        return f"{self.location}"


class TextClassificationJob(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    type = fields.CharField(max_length=200, default='text_classification')
    project = fields.ForeignKeyField(
        'models.Project', related_name='Jobs_TC')
    file_data_source = fields.ForeignKeyField('models.FileDataSource',
                                              related_name='classificationJobs')
    annotation_collection_name = fields.CharField(max_length=200)
    created_at = fields.DatetimeField(auto_now_add=True)
    created_by = fields.ForeignKeyField(
        'models.User',
        related_name='created_by_tc',
    )
    assigned_annotators = fields.ManyToManyField(
        'models.User', related_name='assigned_annotators_tc')
    assigned_reviewer = fields.ForeignKeyField(
        'models.User',
        related_name='assigned_reviewer_tc',
        null=True
    )
    field_to_annotate = fields.CharField(max_length=200)
    classes_list_as_string = fields.CharField(max_length=1000)
    allow_multi_classification = fields.BooleanField(default=False)
    active_learning = fields.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Text Classification: {self.title}"


class PartOfSpeechJob(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    type = fields.CharField(max_length=200, default='part_of_speech')
    project = fields.ForeignKeyField(
        'models.Project', related_name='Jobs_Pos')
    file_data_source = fields.ForeignKeyField('models.FileDataSource',
                                              related_name='posJobs')
    annotation_collection_name = fields.CharField(max_length=200)
    created_at = fields.DatetimeField(auto_now_add=True)
    created_by = fields.ForeignKeyField(
        'models.User',
        related_name='created_by_pos'
    )
    assigned_annotators = fields.ManyToManyField(
        'models.User', related_name='assigned_annotators_pos')
    assigned_reviewer = fields.ForeignKeyField(
        'models.User',
        related_name='assigned_reviewer_pos',
        null=True
    )
    field_to_annotate = fields.CharField(max_length=200)
    tags_list_as_string = fields.CharField(max_length=1000)
    active_learning = fields.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Part Of Speech: {self.title}"


class NamedEntityRecognitionJob(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=100)
    type = fields.CharField(max_length=200, default='named_entity_recognition')
    project = fields.ForeignKeyField(
        'models.Project', related_name='Jobs_Ner')
    file_data_source = fields.ForeignKeyField('models.FileDataSource',
                                              related_name='nerJobs')
    annotation_collection_name = fields.CharField(max_length=200)
    created_at = fields.DatetimeField(auto_now_add=True)
    created_by = fields.ForeignKeyField(
        'models.User',
        related_name='created_by_ner'
    )
    assigned_annotators = fields.ManyToManyField(
        'models.User', related_name='assigned_annotators_ner')
    assigned_reviewer = fields.ForeignKeyField(
        'models.User',
        related_name='named_entity_recognition',
        null=True
    )
    field_to_annotate = fields.CharField(max_length=200)
    tags_list_as_string = fields.CharField(max_length=1000)
    active_learning = fields.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Named Entity Recognition: {self.title}"
