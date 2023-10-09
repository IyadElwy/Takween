from tortoise import Tortoise
from tortoise import run_async


async def init():
    # Here we create a SQLite DB using file "db.sqlite3"
    #  also specify the app name of "models"
    #  which contain models from "app.models"
    await Tortoise.init(
        db_url='sqlite://db.sqlite3',
        modules={'models': ['models.models']}
    )
    # Generate the schema
    await Tortoise.generate_schemas()


run_async(init())
