from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.entity.profile import Profile
from src.controller.app.authentication.permission_required import permission_required

update_profile_blueprint = Blueprint('update_profile', __name__)

@update_profile_blueprint.route('/api/profile/update_profile', methods=['PUT'])
@jwt_required()
@permission_required('has_admin_permission')
def update_profile():
    data = request.get_json()

    required_fields = ['name', 'description', 'has_buy_permission', 'has_sell_permission', 'has_listing_permission']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        success = Profile.updateUserProfile(
            name=data['name'],
            description=data['description'],
            has_buy_permission=bool(data['has_buy_permission']),
            has_sell_permission=bool(data['has_sell_permission']),
            has_listing_permission=bool(data['has_listing_permission'])
        )

        if success:
            return jsonify({'message': 'Profile updated successfully'}), 200
        else:
            return jsonify({'error': 'Failed to update profile'}), 400

    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500