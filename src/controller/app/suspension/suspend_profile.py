# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Suspension, User
from src.controller.app.authentication.permission_required import permission_required

suspend_profile_blueprint = Blueprint('suspend_profile', __name__)
class SuspendProfileController:
    @suspend_profile_blueprint.route('/api/suspension/suspend_profile', methods=['POST'])
    @permission_required('has_admin_permission')
    def suspend_profile():
        
        data = request.get_json()
        profile = data.get('profile')
        days = data.get('days')
        reason = data.get('reason')
        suspend_user_response = False

        # Validate input
        if not profile or not days:
            return jsonify({'success': False, 'message': 'Profile and days are required.'}), 400
        
        suspend_user_response, status_code = Suspension.suspendProfile(profile, days, reason)

        return jsonify({'success': suspend_user_response, 'message': 'suspend_profile API called'}), status_code
