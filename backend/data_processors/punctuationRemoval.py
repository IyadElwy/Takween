import json
import re

arabic_symbols_pattern = r'[؟!،:؛.١٢٣٤٥٦٧٨٩٠]'


def process_punctuation_removal(job_data, file_path, original_datasource_path, field_to_process):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            for current_object in data:
                try:
                    no_punctuation = re.sub(
                        arabic_symbols_pattern, ' ', current_object[field_to_process])
                    result_file.write(json.dumps(
                        {field_to_process: no_punctuation}) + '\n')
                except Exception as e:
                    continue
