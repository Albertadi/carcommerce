from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.entity.user import User
from src.controller.app.profile.auth_admin import admin_required

user_profile_blueprint = Blueprint('user_profile', __name__)

@user_profile_blueprint.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_own_profile():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'name':user.name,
        'email': user.email,
        'user_profile': user.user_profile
        # Add any other non-sensitive fields yang kita mau include
    }), 200

@user_profile_blueprint.route('/api/user/profile/<int:user_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_user_profile(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'name':user.name,
        'email': user.email,
        'user_profile': user.user_profile
        # Add any other non-sensitive fields yang kita mau include
    }), 200

# 