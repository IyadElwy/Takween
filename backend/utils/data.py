import pandas as pd
import json


def get_json_sample_from_file(data, depth=1, max_elements=5):
    if depth <= 0:
        return data

    if isinstance(data, dict):
        sample = {}
        for key, value in data.items():
            sample[key] = get_json_sample_from_file(
                value, depth - 1, max_elements)
        return sample

    elif isinstance(data, list):
        sample = []
        for item in data[:max_elements]:
            sample.append(get_json_sample_from_file(
                item, depth - 1, max_elements))
        return sample

    else:
        return data


def convert_csv_to_json_and_save(file_location: str):
    new_file_location = file_location.replace('.csv', '.json')
    df = pd.read_csv(file_location)
    df.to_json(new_file_location, 'records')
    return new_file_location


def convert_tsv_to_json_and_save(file_location: str):
    new_file_location = file_location.replace('.tsv', '.json')
    df = pd.read_csv(file_location, sep='\t')
    df.to_json(new_file_location, 'records')
    return new_file_location


def convert_ndjson_to_json_and_save(file_location: str):
    new_file_location = file_location.replace('.csv', '.json')

    json_list = []
    with open(file_location, 'r') as original_file:
        for ndjson_line in original_file:
            if not ndjson_line.strip():
                continue
            json_line = json.loads(ndjson_line)
            json_list.append(json_line)

    with open(new_file_location, 'w+') as new_file:
        new_file.write(json.dumps(json_list))

    return new_file_location
