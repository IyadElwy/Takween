def get_file_type(file_name: str):
    list_of_supported_file_types = ['csv']
    for file_type in list_of_supported_file_types:
        if file_type in file_name.lower():
            return file_type
