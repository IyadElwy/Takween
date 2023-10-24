import pathlib


def get_file_type(file_name: str):
    list_of_supported_file_types = ['csv', 'tsv', 'json', 'ndjson', 'jsonl']
    file_extension = pathlib.Path(file_name).suffix.lower().replace('.', '')
    if file_extension in list_of_supported_file_types:
        return file_extension
