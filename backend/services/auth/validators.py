from email_validator import validate_email, EmailNotValidError
from errors import ValidationError


def validate_user_signup_info(first_name: str, last_name: str, email: str, password: str):
    if not first_name:
        raise ValidationError("First name must not be empty")
    if not first_name.isalpha():
        raise ValidationError("First name must only contain alphabets")

    if not last_name:
        raise ValidationError("Last name must not be empty")
    if not last_name.isalpha():
        raise ValidationError("Last name must only contain alphabets")

    if not email:
        raise ValidationError("Email must not be empty")
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        raise ValidationError("Email must be valid")

    if not password:
        raise ValidationError("Password must not be empty")


def validate_user_login_info(email: str, password: str):
    if not email:
        raise ValidationError("Email must not be empty")
    try:
        validate_email(email, check_deliverability=False)
    except EmailNotValidError:
        raise ValidationError("Email must be valid")

    if not password:
        raise ValidationError("Password must not be empty")
