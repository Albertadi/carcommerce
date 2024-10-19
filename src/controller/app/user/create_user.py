from flask import Blueprint, request, jsonify
from datetime import datetime
from src.entity.user import User, db
from src.controller.app.profile.auth_admin import admin_required

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

    # Convert 'dob' string to a datetime.date object
    try:
        dob = datetime.strptime(dob, '%Y-%m-%d').date()  # Converts string to a date object
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    # Create a new User object (without 'password')
    new_user = User(email=email, dob=dob, first_name=first_name, last_name=last_name, user_profile=user_profile)

    # Set and hash the password using the set_password method
    new_user.set_password(password)

    # Save the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()}), 201

