from flask import Blueprint, request, jsonify
from src.entity import db, Profile
from src.controller.app.authentication.permission_required import permission_required

create_profile_blueprint = Blueprint('create_profile', __name__)

class CreateProfileController:
    @create_profile_blueprint.route('/api/profiles/create_profile', methods=['POST'])
    @permission_required('has_admin_permission')
    def create_profiling():
        data = request.get_json()

        # Define required fields
        required_fields = ['name', 'description', 'has_buy_permission', 'has_sell_permission', 'has_listing_permission']
        if not all(field in data for field in required_fields):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        try:
            # Create the profile using the Profile entity method
            create_response, status_code = Profile.createUserProfile(
                name=data['name'],
                description=data['description'],
                has_buy_permission=bool(data['has_buy_permission']),
                has_sell_permission=bool(data['has_sell_permission']),
                has_listing_permission=bool(data['has_listing_permission'])
            )

            return jsonify({'success': create_response, 'message': 'Profile created successfully'}), status_code

        except Exception as e:
            return jsonify({'success': False, 'error': f'Failed to create profile: {str(e)}'}), 500
