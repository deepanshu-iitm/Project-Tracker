import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret')
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://deepanshu:12345678@localhost/project_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_secret')
    JWT_TOKEN_LOCATION = ['headers'] 