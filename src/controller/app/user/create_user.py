from flask import Blueprint, request, jsonify
from datetime import datetime
from src.entity import db, User, Profile
from src.controller.app.authentication.auth_admin import admin_required

create_user_blueprint = Blueprint('create_user', __name__)

@create_user_blueprint.route('/api/users/create_user', methods=['POST'])

@admin_required
def create_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')  # Password to be hashed
    dob = data.get('dob')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    user_profile = data.get('user_profile')

    # Validate fields
    if not email or not password or not dob or not user_profile:
        return jsonify({'error': 'Missing required fields'}), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Account already exists'}), 409
    
    if not Profile.queryUserProfile(profile_name=user_profile):
        return jsonify({'error': 'Profile does not exist'}), 404

    # Convert 'dob' string to a datetime.date object
    try:
        dob = datetime.strptime(dob, '%Y-%m-%d').date()  # Converts string to a date object
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    create_response = User.createUserAccount(email, password, first_name, last_name, dob, user_profile)

    return jsonify({'User created': create_response}), 201

