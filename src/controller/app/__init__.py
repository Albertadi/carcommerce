# Libraries
from flask import Flask
from sqlalchemy import event
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from datetime import datetime

# Local dependencies
from src.entity import db, User, Profile, Listing
from .authentication.login import login_blueprint
from .user.create_user import create_user_blueprint
from .user.search_user import search_user_blueprint
from .user.search_agent import search_agent_blueprint
from .user.view_user import view_user_blueprint
from .user.update_user import update_user_blueprint
from .profile.create_profile import create_profile_blueprint
from .profile.update_profile import update_profile_blueprint
from .profile.view_profile import view_profile_blueprint
from .listing.create_listing import create_listing_blueprint

# Initialize Flask App
flask_app = Flask(__name__)

# Configurations
flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
flask_app.config['SQLALCHEMY_ECHO'] = True
flask_app.config['JWT_SECRET_KEY'] = 'secret_key' # In an actual project, use os.environ.get('SECRET_KEY')

CORS(flask_app)  # Enable CORS for cross-origin requests from Next.js

# JWT
jwt = JWTManager(flask_app)

# SQLAlchemy
db.init_app(flask_app)

with flask_app.app_context():
    db.create_all()
    if not Profile.query.filter_by(name="admin").one_or_none():
        adminProfile = Profile(
            name="admin",
            description="Admin Profile",
            has_admin_permission=True
        )
        db.session.add(adminProfile)
    
    if not User.query.filter_by(email="admin@admin.com").one_or_none():
        adminAccount = User(
            email="admin@admin.com",
            password=generate_password_hash("admin"),
            first_name="Ad",
            last_name="Min",
            dob= datetime.strptime("2000-01-01", "%Y-%m-%d").date(),
            user_profile="admin"
        )
        db.session.add(adminAccount)

    db.session.commit()
    

@flask_app.route('/api/hello', methods=['GET'])
def hello():
    return {'message': 'Hello from Flask!'}, 200

# Load all routes
# Authentication
flask_app.register_blueprint(login_blueprint)

# User
flask_app.register_blueprint(create_user_blueprint)
flask_app.register_blueprint(search_user_blueprint)
flask_app.register_blueprint(search_agent_blueprint)
flask_app.register_blueprint(view_user_blueprint)
flask_app.register_blueprint(update_user_blueprint)

# Profile
flask_app.register_blueprint(create_profile_blueprint)
flask_app.register_blueprint(update_profile_blueprint)
flask_app.register_blueprint(view_profile_blueprint)

# Listing
flask_app.register_blueprint(create_listing_blueprint)


# Suspension

# ReviewRating


