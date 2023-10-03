from tortoise.models import Model
from tortoise import fields


class Project(Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=20)
    description = fields.CharField(max_length=1000, null=True)
    author = fields.CharField(max_length=20, null=True)
    dataFileName = fields.CharField(max_length=400, null=True)

    def __str__(self) -> str:
        return self.title
