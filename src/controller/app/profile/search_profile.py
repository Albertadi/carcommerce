from flask import Blueprint, request, jsonify
from src.entity.profile import Profile
from src.controller.app.authentication.permission_required import permission_required

search_profile_blueprint = Blueprint('search_profile', __name__)

@search_profile_blueprint.route('/api/profile/search_profile', methods=['GET'])
@permission_required('has_admin_permission')

def search_profile():
    account_list = []
    
    for profile in Profile.query.all():
        account_list.append(profile.to_dict())

    return jsonify({"message": "Success", "account_list": account_list})
