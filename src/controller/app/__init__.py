# Libraries
from flask import Flask, send_from_directory
from sqlalchemy import event
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
from datetime import datetime
from datetime import timedelta
import os

# Local dependencies
from src.entity import db, User, Profile
from .authentication.login import login_blueprint
from .user.create_user import create_user_blueprint
from .user.search_user import search_user_blueprint
from .authentication.login import login_blueprint
from .review.create_reviewRating import create_reviewRating_blueprint
from .review.view_reviewRating import view_reviewRating_blueprint
from .user.search_agent import search_agent_blueprint
from .user.view_user import view_user_blueprint
from .user.update_user import update_user_blueprint
from .profile.create_profile import create_profile_blueprint
from .profile.update_profile import update_profile_blueprint
from .profile.view_profile import view_profile_blueprint
from .profile.search_profile import search_profile_blueprint
from .listing.create_listing import create_listing_blueprint
from .listing.view_listing import view_listing_blueprint
from .listing.update_listing import update_listing_blueprint
from .listing.delete_listing import delete_listing_blueprint
from .listing.search_listing import search_listing_blueprint
from .suspension.suspend_user import suspend_user_blueprint
from .suspension.suspend_profile import suspend_profile_blueprint
from .shortlist.see_num_car_shortlist import see_num_car_shortlist_blueprint
from .shortlist.saveto_shortlist import saveto_shortlist_blueprint
from .shortlist.search_shortlist import search_shortlist_blueprint
from .shortlist.view_shortlist import view_shortlist_blueprint
from .suspension.check_user_suspended import check_user_suspended_blueprint
from .views.get_views import get_views_blueprint
from .views.increment_views import increment_views_blueprint
from .loan_calculator.loan_calculator import loan_calculator_blueprint

# Initialize Flask App
flask_app = Flask(__name__)

# Configurations
flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
flask_app.config['SQLALCHEMY_ECHO'] = True
flask_app.config['JWT_SECRET_KEY'] = 'secret_key' # In an actual project, use os.environ.get('SECRET_KEY')
flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
flask_app.config['UPLOAD_FOLDER'] = os.path.join(flask_app.root_path, 'uploads')

if not os.path.exists(flask_app.config['UPLOAD_FOLDER']):
    os.makedirs(flask_app.config['UPLOAD_FOLDER'])


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
    

@flask_app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(flask_app.config['UPLOAD_FOLDER'], filename)

# Load all routes
# Authentication
flask_app.register_blueprint(login_blueprint)

# User
flask_app.register_blueprint(create_user_blueprint)
flask_app.register_blueprint(view_user_blueprint)
flask_app.register_blueprint(update_user_blueprint)
flask_app.register_blueprint(search_user_blueprint)
flask_app.register_blueprint(search_agent_blueprint)

# Profile
flask_app.register_blueprint(create_profile_blueprint)
flask_app.register_blueprint(view_profile_blueprint)
flask_app.register_blueprint(update_profile_blueprint)
flask_app.register_blueprint(search_profile_blueprint)

# Listing
flask_app.register_blueprint(create_listing_blueprint)
flask_app.register_blueprint(view_listing_blueprint)
flask_app.register_blueprint(update_listing_blueprint)
flask_app.register_blueprint(delete_listing_blueprint)
flask_app.register_blueprint(search_listing_blueprint)

# Suspension
flask_app.register_blueprint(suspend_user_blueprint)
flask_app.register_blueprint(suspend_profile_blueprint)
flask_app.register_blueprint(check_user_suspended_blueprint)

#shortlist
flask_app.register_blueprint(see_num_car_shortlist_blueprint)
flask_app.register_blueprint(saveto_shortlist_blueprint)
flask_app.register_blueprint(search_shortlist_blueprint)
flask_app.register_blueprint(view_shortlist_blueprint)

# Review Rating
flask_app.register_blueprint(create_reviewRating_blueprint)
flask_app.register_blueprint(view_reviewRating_blueprint)

# Views
flask_app.register_blueprint(increment_views_blueprint)
flask_app.register_blueprint(get_views_blueprint)

# Loan Calculator
flask_app.register_blueprint(loan_calculator_blueprint)
