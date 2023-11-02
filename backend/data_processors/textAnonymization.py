import json
import re


def anonymize_text(text):
    date_pattern = r'\d{1,2}/\d{1,2}/\d{2,4}'
    url_pattern = r'https?://\S+|www\.\S+'
    email_pattern = r'\S+@\S+'
    number_pattern = r'\d+'

    text = re.sub(date_pattern, '****', text)
    text = re.sub(url_pattern, '****', text)
    text = re.sub(email_pattern, '****', text)
    text = re.sub(number_pattern, '****', text)

    return text


def process_text_anonymization(job_data, file_path, original_datasource_path, field_to_process):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            for current_object in data:
                try:
                    anonymized = anonymize_text(
                        current_object[field_to_process])
                    result_file.write(json.dumps(
                        {field_to_process: anonymized}) + '\n')
                except Exception as e:
                    continue
