from enum import Enum


class AnnotationType(Enum):
    TEXT_CLASSIFICATION = 'Text Classification'
    NAMED_ENTITY_RECOGNITION = 'Named Entity Recognition'
    PART_OF_SPEECH_TAGS = 'Part Of Speech Tags'
    TABULAR = 'Tabular'


def parse_to_enum(input_string: str):
    match input_string:
        case 'tabular':
            return AnnotationType.TABULAR
