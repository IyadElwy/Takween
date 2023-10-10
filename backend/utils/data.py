
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
