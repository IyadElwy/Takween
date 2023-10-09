from enum import Enum


class FileType(Enum):
    CSV = 'csv'


def parse_to_enum(input_string: str):
    match input_string:
        case 'csv':
            return FileType.CSV
