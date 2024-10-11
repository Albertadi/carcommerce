# src/controller/user_controller.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from src.entity.user import User, db

user_blueprint = Blueprint('users', __name__)

@user_blueprint.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()

    name = data.get('name')
    password = data.get('password')  # Password to be hashed
    dob = data.get('dob')
    user_profile = data.get('user_profile')

    # Validate fields
    if not name or not password or not dob or not user_profile:
        return jsonify({'error': 'Missing required fields'}), 400

    # Convert 'dob' string to a datetime.date object
    try:
        dob = datetime.strptime(dob, '%Y-%m-%d').date()  # Converts string to a date object
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    # Create a new User object (without 'password')
    new_user = User(name=name, dob=dob, user_profile=user_profile)

    # Set and hash the password using the set_password method
    new_user.set_password(password)

    # Save the user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully', 'user': new_user.to_dict()}), 201

@user_blueprint.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200
