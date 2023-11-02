import json
from pyarabic.araby import tokenize


def process_tokenizing(job_data, file_path, original_datasource_path, field_to_process):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            for current_object in data:
                try:
                    tokenize_sentence = tokenize(
                        current_object[field_to_process])
                    result_file.write(json.dumps(
                        {field_to_process: tokenize_sentence}) + '\n')
                except Exception as e:
                    continue
