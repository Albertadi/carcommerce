from flask import Blueprint, request, jsonify
from src.entity.profile import Profile  # Change the import for Profile
from src.controller.app.authentication.permission_required import permission_required

search_profile_blueprint = Blueprint('search_profile', __name__)

class SearchProfileController:
    @search_profile_blueprint.route('/api/profiles/search_profile', methods=['POST'])
    @permission_required('has_admin_permission')
    def search_profile():
        data = request.get_json()

        name = data.get('name')
        description = data.get('description')
        
        # Assuming there is a searchProfile method in Profile model similar to User
        profile_list = Profile.searchUserProfile(name, description)

        return jsonify({"success": True, "profile_list": profile_list}), 200