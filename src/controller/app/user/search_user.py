from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.auth_admin import admin_required

search_user_blueprint = Blueprint('search_user', __name__)

@search_user_blueprint.route('/api/users/search_user', methods=['GET'])
@admin_required
def search_user():
    account_list = []
    #add if condition if user not in suspension
    for user in User.query.all():
        account_list.append(user.to_dict())

    return jsonify({"message": "Success", "account_list": account_list})