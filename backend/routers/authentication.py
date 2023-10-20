from fastapi import APIRouter, HTTPException, Request
import os
from dotenv import load_dotenv
import bcrypt
import jwt
from models.models import User
import datetime
from tortoise.exceptions import IntegrityError, DoesNotExist

load_dotenv()
salt = os.getenv("SALT")
jwt_secret = os.getenv("JWT_SECRET")


router = APIRouter()


@router.post("/signup")
async def sign_up(request: Request):
    try:
        body = await request.json()
        hashed_password = bcrypt.hashpw(
            body['password'].encode(), salt.encode()).decode('utf-8')  # type: ignore
        user = await User.create(
            first_name=body['firstName'],
            last_name=body['lastName'],
            email=body['email'],
            password=hashed_password,
        )
        payload = {
            'user_id': str(user.id),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)
        }
        token = jwt.encode(payload, jwt_secret, algorithm='HS256')
        return {'access_token': token}
    except IntegrityError as e:
        raise HTTPException(
            status_code=409, detail='user with this email already exists')
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/signin")
async def sign_in(request: Request):
    try:
        body = await request.json()
        email = body['email']
        user = await User.get(email=email)
        if bcrypt.checkpw(body['password'].encode(),
                          user.password.encode()):
            payload = {
                'user_id': str(user.id),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90)
            }
            token = jwt.encode(payload, jwt_secret, algorithm='HS256')
            return {'access_token': token}
        else:
            raise Exception('incorrect password')
    except DoesNotExist:
        raise HTTPException(status_code=404, detail='user not found')
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
