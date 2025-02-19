from flask import Flask
from app.utils.db import init_db
from app.routes import register_routes
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config') 

    init_db(app)
    jwt.init_app(app)
    CORS(app)
    register_routes(app)

    @app.route('/')
    def home():
        return "Backend is running!"

    return app