import pathlib


def get_file_type(file_name: str):
    file_extension = pathlib.Path(file_name).suffix.replace('.', '').lower()
    return file_extension
