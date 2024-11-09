from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

view_user_blueprint = Blueprint('view_user', __name__)

class ViewUserController:
    # View individual user detail
    @view_user_blueprint.route('/api/users/view_user', methods=['GET'])
    def view_user():
        user_email = request.args.get('email')

        if not user_email:
            return jsonify({"success": False, "error": "Email parameter not provided"}), 400
        
        user, status_code = User.viewUserAccount(user_email)

        return jsonify({"success": True, "user": user}), status_code