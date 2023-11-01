import wikipediaapi
import json


def extract_data_from_wikipedia(parameters, file_path):
    language = 'ar' if parameters['language'] == 'Arabic' else 'en'
    slugs = [url.split('wiki/')[-1].replace('-', ' ').replace('_', ' ')
             for url in parameters['urls'].strip().split(",")]
    wikipedia_searcher = wikipediaapi.Wikipedia('wikipedia api', language)

    with open(file_path, '+a') as file:
        for slug in slugs:
            page = wikipedia_searcher.page(slug)
            if page.exists():
                sentences = page.text.split(".")
                for sentence in sentences:
                    file.write(json.dumps(
                        {"pageTitle": slug,
                         "language": language,
                         "text": sentence}) + '\n')
