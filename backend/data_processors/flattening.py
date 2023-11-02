import json
from flatten_json import flatten


def process_flattening(job_data, file_path, original_datasource_path):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            for current_object in data:
                try:
                    result_file.write(json.dumps(
                        flatten(current_object)) + '\n')
                except Exception as e:
                    continue
