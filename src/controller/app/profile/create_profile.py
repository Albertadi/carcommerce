from flask import Blueprint, request, jsonify
from src.entity import Profile, db
from src.controller.app.authentication.auth_admin import admin_required

create_profile_blueprint = Blueprint('create_profile', __name__)

@create_profile_blueprint.route('/api/profile', methods=['POST'])
@admin_required
def create_profiling():
    data = request.get_json()

    required_fields = ['name', 'description', 'has_buy_permission', 'has_sell_permission', 'has_listing_permission']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        new_profile = Profile(
            name=data['name'],
            description=data['description'],
            has_buy_permission=bool(data['has_buy_permission']),
            has_sell_permission=bool(data['has_sell_permission']),
            has_listing_permission=bool(data['has_listing_permission'])
        )
        
        db.session.add(new_profile)
        db.session.commit()

        return jsonify({'message': 'Profile created successfully', 'profile': new_profile.to_dict()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create profile: {str(e)}'}), 500