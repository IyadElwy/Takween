import json
import pathlib
from typing import IO

import pandas as pd
from errors import FileConversionException


def convert_file_to_json_dict(file_name: str, file: IO):
    file_type = get_file_type(file_name)
    try:
        match file_type:
            case 'csv' | 'tsv':
                return convert_csv_or_tsv_to_dict(file)
            case 'json':
                return json.load(file)
    except Exception:
        raise FileConversionException()


def convert_csv_or_tsv_to_dict(file: IO) -> dict:
    df = pd.read_csv(file)
    reformatted_to_dict = df.to_dict('records')
    return reformatted_to_dict


def get_file_type(file_name: str):
    file_extension = pathlib.Path(file_name).suffix.replace('.', '').lower()
    return file_extension
