from flask import Blueprint, request, jsonify
from src.entity.profile import Profile
from src.controller.app.authentication.permission_required import permission_required

search_profile_blueprint = Blueprint('search_profile', __name__)

@search_profile_blueprint.route('/api/profile/search_profile', methods=['GET'])
@permission_required('has_admin_permission')
def search_profile():
    account_list = []
    
    # Get the role query parameter from the request
    role = request.args.get('role', None)

    # If no role is provided, return an error message
    if not role:
        return jsonify({"message": "Error", "error": "Role parameter is required to perform a search"}), 400

    # Filter profiles by role
    profiles = Profile.query.filter_by(role=role).all()

    # If no profiles match the role, return a message
    if not profiles:
        return jsonify({"message": "No profiles found for the specified role"}), 404

    # Convert each profile to dictionary format
    for profile in profiles:
        account_list.append(profile.to_dict())

    return jsonify({"message": "Success", "account_list": account_list})
