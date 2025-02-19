from flask_jwt_extended import create_access_token, decode_token
from datetime import timedelta

def generate_jwt(user_id, role, exp=24):
    expires_delta = timedelta(hours=exp)
    additional_claims = {"role": role}  
    return create_access_token(identity=str(user_id), expires_delta=expires_delta, additional_claims=additional_claims)


def decode_jwt(token):
    try:
        decoded = decode_token(token)
        return decoded
    except Exception as e:
        print(f"Token decoding failed: {e}")
        return None
