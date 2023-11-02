import json


def process_merging(job_data, file_path, original_datasource_paths, field_to_process):
    with open(file_path, '+a') as result_file:
        for original_datasource_path in original_datasource_paths:
            with open(original_datasource_path, 'r') as og_file:
                data = json.load(og_file)
                for current_object in data:
                    if current_object.get(field_to_process):
                        result_file.write(
                            json.dumps({field_to_process: current_object.get(field_to_process)}) + '\n')
