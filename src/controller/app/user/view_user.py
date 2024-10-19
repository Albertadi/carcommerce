from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.profile.auth_admin import admin_required

view_user_blueprint = Blueprint('view_user', __name__)

# View individual user detail
@view_user_blueprint.route('/api/users/view_user', methods=['GET'])
@admin_required
def view_user():
    user_email = request.args.get('email')

    if not user_email:
        return jsonify({"error": "Email parameter not provided"}), 400
    
    user = User.query.get(user_email)

    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.to_dict()), 200