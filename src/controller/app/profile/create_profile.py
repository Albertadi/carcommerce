from flask import Blueprint, request, jsonify, current_app
from src.entity.user import Profile
from src.controller.app.authentication.auth_admin import admin_required

create_profile_blueprint = Blueprint('create_profile', __name__)

@create_profile_blueprint.route('/api/create_profile', methods=['POST'])
@admin_required
def create_profiling():
    data = request.get_json()

    required_fields = ['name', 'description', 'has_buy_permission', 'has_sell_permission', 'has_listing_permission']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        result = Profile.createUserProfile(
            name=data['name'],
            description=data['description'],
            has_buy_permission=bool(data['has_buy_permission']),
            has_sell_permission=bool(data['has_sell_permission']),
            has_listing_permission=bool(data['has_listing_permission'])
        )

        if result:
            return jsonify({'message': 'Profile created successfully'}), 201
        else:
            return jsonify({'error': 'Failed to create profile. Profile may already exist or has admin permission.'}), 400

    except Exception as e:
        return jsonify({'error': f'Failed to create profile: {str(e)}'}), 500