import base64
import time
import jwt

SECRET_KEY = 'i love unicorns'

def generate_jwt_token(body, duration):
    token = jwt.encode(
        payload = {
            'body' : body,
            'time' : time.time() + duration
        },
        key = SECRET_KEY,
        algorithm = 'HS256'
    )
    return token

def decode_token(token, duration):
    is_valid = False
    body = ''
    try:
        payload = jwt.decode(token, key=SECRET_KEY, algorithms = 'HS256')
        if payload['time'] + duration > time.time():
            is_valid = True
        body = payload['body']
    finally:
        return {'body': body, 'is_valid' : is_valid}