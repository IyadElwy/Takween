from enum import Enum


class FileType(Enum):
    CSV = 'csv'
    JSON = 'json'
    JSONl = 'jsonl'
    NDJSON = 'ndjson'


def parse_to_enum(input_string: str):
    match input_string:
        case 'csv':
            return FileType.CSV
        case 'json':
            return FileType.JSON
        case 'jsonl':
            return FileType.JSONl
        case 'ndjson':
            return FileType.NDJSON
