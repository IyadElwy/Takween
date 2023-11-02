import json
import arabicstopwords.arabicstopwords as stp


def process_stop_word_removal(job_data, file_path, original_datasource_path, field_to_process):
    with open(original_datasource_path, 'r') as og_file:
        data = json.load(og_file)
        with open(file_path, '+a') as result_file:
            for current_object in data:
                try:
                    no_stop_words = " ".join(
                        [wrd if not stp.is_stop(wrd) else "" for wrd in current_object[field_to_process].split(" ")])
                    result_file.write(json.dumps(
                        {field_to_process: no_stop_words}) + '\n')
                except Exception as e:
                    continue
