import json

import polars as pl


def convert_to_parquet(file_buffer: bytes, file_type: str) -> pl.DataFrame:
    match file_type:
        case 'parquet':
            df = pl.read_parquet(file_buffer)
        case 'json':
            df = pl.json_normalize(json.loads(file_buffer))
        case 'csv':
            df = pl.read_csv(file_buffer, ignore_errors=True)
    return df


def return_annotatable_fields(df: pl.DataFrame) -> list[str]:
    annotatable_dtypes = [pl.String]
    annotatable_columns = []
    for col, dtype in zip(df.columns, df.dtypes, strict=True):
        if dtype in annotatable_dtypes:
            annotatable_columns.append(col)
    return annotatable_columns
