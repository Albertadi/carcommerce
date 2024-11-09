from flask import Blueprint, request, jsonify
from src.entity.profile import Profile
from src.controller.app.authentication.permission_required import permission_required

view_profile_blueprint = Blueprint('view_profile', __name__)

class ViewProfileController:
    # View individual user profile detail
    @view_profile_blueprint.route('/api/profiles/view_profile', methods=['GET'])
    @permission_required('has_admin_permission')
    def view_profile():
        profile_name = request.args.get('name')

        if not profile_name:
            return jsonify({"success": False, "error": "Name parameter not provided"}), 400
        
        profile, view_response, status_code = Profile.viewUserProfile(profile_name)

        return jsonify({"success": view_response, "profile": profile}), status_code
