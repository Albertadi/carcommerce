from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

update_user_blueprint = Blueprint('update_user', __name__)

@update_user_blueprint.route('/api/users/update_user', methods=['POST'])
@permission_required('has_admin_permission')
def update_user():
    updated_details = request.get_json()

    email = updated_details.get('email')
    new_password = updated_details.get('password')
    new_first_name = updated_details.get('first_name')
    new_last_name = updated_details.get('last_name')
    new_dob = updated_details.get('dob')
    new_user_profile = updated_details.get('user_profile')

    update_response, status_code = User.updateUserAccount(
        email=email,
        password=new_password,
        first_name=new_first_name,
        last_name=new_last_name,
        dob=new_dob,
        user_profile=new_user_profile
    )

    return jsonify({"success": update_response, "message": "update_user API called"}), status_code
