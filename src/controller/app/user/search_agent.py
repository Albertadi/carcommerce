from flask import Blueprint, request, jsonify
from src.entity.user import User

search_agent_blueprint = Blueprint('search_agent', __name__)

@search_agent_blueprint.route('/api/users/search_agent', methods=['GET'])
#add permission, either user or seller
def search_agent():
    account_list = []
    #add if condition if user not in suspension
    for user in User.query.all():
        if (user.user_profile == "agent"):
            account_list.append(user.to_dict())

    return jsonify({"message": "Success", "account_list": account_list})