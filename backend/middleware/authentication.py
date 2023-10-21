import jwt
from fastapi import Request
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()
jwt_secret = os.getenv("JWT_SECRET")

paths_to_skip = ['/signin', '/signup']


async def authenticate_user(request: Request, call_next):
    if request.method == "OPTIONS":
        response = JSONResponse(content={}, status_code=200)
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "*"
        return response
    else:
        path = request.url.path
        if path in paths_to_skip:
            response = await call_next(request)
            return response

        auth_header = request.headers.get("Authorization")
        if auth_header:
            token = auth_header.split("Bearer ")[1]
            decoded_token = jwt.decode(
                token, key=jwt_secret, algorithms=['HS256'])
            request.state.user_id = decoded_token['user_id']
            response = await call_next(request)
            return response
        else:
            response = JSONResponse(
                content={"error": "Authentication failed"}, status_code=401)
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "*"
            return response
