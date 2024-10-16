from flask import Blueprint, request, jsonify
# Blueprint for creating a blueprint (a way to organize a group of related routes)
# request to handle incoming HTTP requests
# jsonify to convert Python dictionaries to JSON Responses

from src.entity.user import User, db
# used to import the user model and database object 

from src.profile.auth_admin import admin_required
# implement this so that the only one who can change role is only the user

admin_blueprint = Blueprint('admin', __name__)

@admin_blueprint.route('/api/admin/assign-role', methods=['POST'])
@admin_required  # This decorator ensures only admins can access this route
def assign_role():
    data = request.get_json()
    user_id = data.get('user_id')
    role = data.get('role')

    if not user_id or not role:
        return jsonify({'error': 'Missing user_id or role'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if role not in ['buyer', 'seller', 'used_car_agent', 'admin']:
        return jsonify({'error': 'Invalid role'}), 400

    user.user_profile = role
    db.session.commit()

    return jsonify({'message': 'Role assigned successfully', 'user_id': user.id, 'role': role}), 200
