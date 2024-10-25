# Libraries
from flask import Blueprint, request, jsonify

# Local Dependencies
from src.entity import User, Token

login_blueprint = Blueprint("login", __name__)

class LoginController:
    @login_blueprint.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()

        if not data or not 'email' in data or not 'password' in data:
            return jsonify({"success": False, "error": "Email and password not provided"}), 400
        
        email = data['email']
        password = data['password']

        # Query user from database
        loginValid = User.checkLogin(email, password)

        if not loginValid:
            return jsonify({"success": False, "error": "Invalid email or password"})
        
        # Create or Renew JWT Token
        success, access_token = Token.createAccessToken(email)
        
        if success:
            return jsonify({
                'success': success,
                'access_token': access_token
            }), 200
        
        return jsonify({
            'success': success,
            'access_token': access_token
        }), 500