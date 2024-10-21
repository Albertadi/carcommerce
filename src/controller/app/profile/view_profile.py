from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.entity.profile import Profile
from src.controller.app.authentication.auth_admin import admin_required

view_profile_blueprint = Blueprint('view_profile', __name__)

@view_profile_blueprint.route('/api/profile/view_profile', methods=['GET'])
@jwt_required()
def get_own_profile():
    current_user = get_jwt_identity()
    profile = Profile.query.get(current_user)
    
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404
    
    return jsonify({
        'name': profile.name,
        'description': profile.description,
        'has_buy_permission': profile.has_buy_permission,
        'has_sell_permission': profile.has_sell_permission,
        'has_listing_permission': profile.has_listing_permission,
        'has_admin_permission': profile.has_admin_permission
    }), 200

@view_profile_blueprint.route('/api/profile/view/<string:profile_name>', methods=['GET'])
@jwt_required()
@admin_required
def get_user_profile(profile_name):
    profile = Profile.query.get(profile_name)
    
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404
    
    return jsonify({
        'name': profile.name,
        'description': profile.description,
        'has_buy_permission': profile.has_buy_permission,
        'has_sell_permission': profile.has_sell_permission,
        'has_listing_permission': profile.has_listing_permission,
        'has_admin_permission': profile.has_admin_permission
    }), 200