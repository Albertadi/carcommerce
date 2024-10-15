from flask import Blueprint, request, jsonify
from src.entity.user import User

search_user_blueprint = Blueprint('search_user', __name__)

@search_user_blueprint.route('/api/users/', methods=['GET'])
def search_user():
    user_email = request.args.get('email')

    if not user_email:
        return jsonify({"error": "Email parameter not provided"}), 400
    
    user = User.query.get(user_email)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200
