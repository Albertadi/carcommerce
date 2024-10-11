# Libraries
from flask import Flask
from sqlalchemy import event
from flask_cors import CORS

# Local dependencies
from src.entity import db
from .user.create_user import user_blueprint

# Initialize Flask App
flask_app = Flask(__name__)

# Configurations
flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(flask_app)  # Enable CORS for cross-origin requests from Next.js

# SQLAlchemy
db.init_app(flask_app)

with flask_app.app_context():
    db.create_all()

@flask_app.route('/api/hello', methods=['GET'])
def hello():
    return {'message': 'Hello from Flask!'}, 200

# Load all routes
# User
flask_app.register_blueprint(user_blueprint)
