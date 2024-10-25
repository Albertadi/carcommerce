from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

search_user_blueprint = Blueprint('search_user', __name__)

class SearchUserController:
    @search_user_blueprint.route('/api/users/search_user', methods=['POST'])
    @permission_required('has_admin_permission')
    def search_user():
        data = request.get_json()

        email = data.get('email')
        first_name = data.get('first_name')
        user_profile = data.get('user_profile')

        account_list = User.searchUserAccount(email, first_name, user_profile)

        return jsonify({"message": "Success", "account_list": account_list})