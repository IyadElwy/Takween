from tortoise.models import Model
from tortoise import fields


class Project(Model):
    id = fields.UUIDField(pk=True)
    author = fields.CharField(max_length=20)
    title = fields.CharField(max_length=20)
    description = fields.CharField(max_length=100)
    dataFileName = fields.CharField(max_length=20)

    def __str__(self) -> str:
        return self.title
