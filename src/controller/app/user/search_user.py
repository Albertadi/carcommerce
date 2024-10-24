from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

search_user_blueprint = Blueprint('search_user', __name__)

@search_user_blueprint.route('/api/users/search_user', methods=['GET'])
@permission_required('has_admin_permission')
def search_user():
    email = request.args.get('email')
    first_name = request.args.get('first_name')
    user_profile = request.args.get('user_profile')

    account_list = User.searchUserAccount(email, first_name, user_profile)

    return jsonify({"message": "Success", "account_list": account_list})