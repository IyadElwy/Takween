from fastapi import APIRouter, HTTPException, Request
import bcrypt
import jwt
import datetime
from email_validator import validate_email
from pydantic import BaseModel

from models.user import User
from errors import (UniqueFieldException, UserNotFoundException,
                    IncorrectLoginInfo, UserWithEmailAlreadyExists,
                    ValidationException, ValidationError)
from validators import validate_user_signup_info, validate_user_login_info


class SignUpBody(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class SignInBody(BaseModel):
    email: str
    password: str


router = APIRouter()


@router.post("/signup")
async def sign_up(request: Request, sign_up_body: SignUpBody):
    try:
        first_name, last_name, email, password = sign_up_body.first_name, \
            sign_up_body.last_name, sign_up_body.email, sign_up_body.password
        validate_user_signup_info(first_name, last_name, email, password)
        hashed_password = bcrypt.hashpw(
            password.encode(), request.state.config.jwt_salt.encode()).decode('utf-8')
        user = User.create(
            request.state.config.db_conn,
            first_name=first_name,
            last_name=last_name,
            email=validate_email(email, check_deliverability=False).normalized,
            hashed_password=hashed_password,
        )
        payload = {
            'user_id': str(user.id),
            'exp': datetime.datetime.now() + datetime.timedelta(days=90)
        }
        token = jwt.encode(
            payload, request.state.config.jwt_secret, algorithm='HS256')
        return {'access_token': token}
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UniqueFieldException:
        raise UserWithEmailAlreadyExists()


@router.post("/signin")
async def sign_in(request: Request, sign_in_body: SignInBody):
    try:
        email, password = sign_in_body.email, sign_in_body.password
        validate_user_login_info(email, password)
        user = User.get_by_email(request.state.config.db_conn, email=validate_email(
            email, check_deliverability=False).normalized)
        if bcrypt.checkpw(password.encode(),
                          user.hashed_password.encode()):
            payload = {
                'user_id': str(user.id),
                'exp': datetime.datetime.now() + datetime.timedelta(days=90)
            }
            token = jwt.encode(
                payload, request.state.config.jwt_secret, algorithm='HS256')
            return {'access_token': token}
        else:
            raise IncorrectLoginInfo()
    except ValidationException as e:
        raise ValidationError(e.validation_error)
    except UserNotFoundException:
        raise IncorrectLoginInfo()
