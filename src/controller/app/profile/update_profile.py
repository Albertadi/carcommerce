from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.entity.profile import Profile
from src.controller.app.authentication.permission_required import permission_required

update_profile_blueprint = Blueprint('update_profile', __name__)

class UpdateProfileController:
    @update_profile_blueprint.route('/api/profiles/update_profile', methods=['POST'])
    @jwt_required()
    @permission_required('has_admin_permission')
    def update_profile():
        updated_details = request.get_json()

        name = updated_details.get('name')
        description = updated_details.get('description')
        has_buy_permission = updated_details.get('has_buy_permission')
        has_sell_permission = updated_details.get('has_sell_permission')
        has_listing_permission = updated_details.get('has_listing_permission')

        if not all([name, description, has_buy_permission is not None, has_sell_permission is not None, has_listing_permission is not None]):
            return jsonify({'error': 'Missing required fields'}), 400

        try:
            success, status_code = Profile.updateUserProfile(
                name=name,
                description=description,
                has_buy_permission=bool(has_buy_permission),
                has_sell_permission=bool(has_sell_permission),
                has_listing_permission=bool(has_listing_permission)
            )

            return jsonify({"success": success, "message": "Profile updated successfully"}), status_code

        except ValueError as e:
            return jsonify({'error': str(e)}), status_code
        except Exception as e:
            return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), status_code
