from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .routes import register_routes

jwt = JWTManager()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=[app.config["CLIENT_URL"]], supports_credentials=True)
    jwt.init_app(app)

    register_routes(app)
    return app
