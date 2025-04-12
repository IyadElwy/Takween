import pathlib

import magic

from enums.file_type import FileType as FT


def get_file_extension(file_name: str):
    file_extension = pathlib.Path(file_name).suffix.replace('.', '').lower()
    return file_extension.strip()


def extract_file_type(file_buffer: bytes):
    magic_file_type = magic.from_buffer(file_buffer)
    try:
        file_type = FT(magic_file_type)
        match file_type:
            case FT.JSON:
                return 'json'
            case FT.PARQUET:
                return 'parquet'
            case FT.CSV:
                return 'csv'
    except ValueError:
        return None
    except Exception:
        raise
