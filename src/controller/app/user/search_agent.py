from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

search_agent_blueprint = Blueprint('search_agent', __name__)

@search_agent_blueprint.route('/api/users/search_agent', methods=['GET'])
@permission_required('has_buy_permission', 'has_sell_permission')
def search_agent():
    first_name = request.args.get('first_name')

    account_list = User.searchUserAccount(None, first_name, "used car agent")

    return jsonify({"message": "Success", "account_list": account_list})