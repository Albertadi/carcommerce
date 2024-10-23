# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

# Local Dependencies
from src.entity import User, Token

login_blueprint = Blueprint("login", __name__)

class LoginController:
    @login_blueprint.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()

        if not data or not 'email' in data or not 'password' in data:
            return jsonify({"error": "Email and password not provided"}), 400
        
        email = data['email']
        password = data['password']

        # Query user from database
        user, status_code = User.checkLogin(email, password)

        if status_code != 200:
            return jsonify({"error": "Invalid email or password"})
        
        # Create or Renew JWT Token
        success = Token.createAccessToken(user.email)
        
        if success:
            access_token = Token.queryAccessToken(user.email)

            return jsonify({
                'success': success,
                'access_token': access_token
            }), 200
        
        return jsonify({
            'success': success,
            'access_token': ""
        }), 500