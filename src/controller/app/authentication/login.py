# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

# Local Dependencies
from src.entity.user import User

login_blueprint = Blueprint("login", __name__)

@login_blueprint.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not 'email' in data or not 'password' in data:
        return jsonify({"error": "Email and password not provided"}), 400
    
    email = data['email']
    password = data['password']

    # Query user from database
    user = User.query.filter_by(email=email).one_or_none()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Create JWT Token
    access_token = create_access_token(identity={'email': user.email, 'user_profile': user.user_profile})

    return jsonify({
        'message': 'Login success',
        'access_token': access_token
    }), 200