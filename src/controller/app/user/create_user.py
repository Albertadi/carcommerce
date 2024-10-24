from flask import Blueprint, request, jsonify
from datetime import datetime
from src.entity import db, User, Profile
from src.controller.app.authentication.permission_required import permission_required

create_user_blueprint = Blueprint('create_user', __name__)

@create_user_blueprint.route('/api/users/create_user', methods=['POST'])

@permission_required('has_admin_permission')
def create_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')  # Password to be hashed
    dob = data.get('dob')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    user_profile = data.get('user_profile')

    create_response = User.createUserAccount(email, password, first_name, last_name, dob, user_profile)

    return jsonify({'success': create_response, 'message': 'create_user API called'}), 201

