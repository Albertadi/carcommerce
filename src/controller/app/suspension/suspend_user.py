# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Suspension
from src.controller.app.authentication.permission_required import permission_required

suspend_user_blueprint = Blueprint('suspend_user', __name__)
class SuspendUserController:
    @suspend_user_blueprint.route('/api/suspension/suspend_user', methods=['POST'])
    @permission_required('has_admin_permission')
    def suspend_user():
        
        data = request.get_json()
        user_email = data.get('email')
        days = data.get('days')
        reason = data.get('reason')

        # Validate input
        if not user_email or not days:
            return jsonify({'success': False, 'message': 'Email and days are required.'}), 400

        # Call the createSuspension method from the Suspension entity
        create_suspension_response, status_code = Suspension.createSuspension(user_email, days, reason)

        return jsonify({'success': create_suspension_response, 'message': 'create_suspension API called'}), status_code
