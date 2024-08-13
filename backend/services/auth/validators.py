from email_validator import validate_email, EmailNotValidError
from errors import ValidationException


def validate_user_signup_info(
    first_name: str, last_name: str, email: str, password: str
) -> None:
    if not first_name:
        raise ValidationException('First name must not be empty')
    if not first_name.isalpha():
        raise ValidationException('First name must only contain alphabets')

    if not last_name:
        raise ValidationException('Last name must not be empty')
    if not last_name.isalpha():
        raise ValidationException('Last name must only contain alphabets')

    if not email:
        raise ValidationException('Email must not be empty')
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        raise ValidationException('Email must be valid')

    if not password:
        raise ValidationException('Password must not be empty')


def validate_user_login_info(email: str, password: str) -> None:
    if not email:
        raise ValidationException('Email must not be empty')
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        raise ValidationException('Email must be valid')

    if not password:
        raise ValidationException('Password must not be empty')
