import json


def process_duplicate_removal(job_data, file_path, original_datasource_path, field_to_process):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            unique_text = set()
            for current_object in data:
                try:
                    unique_text.add(current_object[field_to_process])
                except Exception as e:
                    continue

            for current_object in unique_text:
                result_file.write(json.dumps(
                    {field_to_process: current_object}) + '\n')
