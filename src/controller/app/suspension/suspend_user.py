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
            return jsonify({'message': 'Email and days are required.'}), 400

        # Call the createSuspension method from the Suspension entity
        success = Suspension.createSuspension(user_email, days, reason)

        if success:
            return jsonify({'message': f'User {user_email} has been suspended for {days} days.'}), 200
        else:
            return jsonify({'message': 'User not found.'}), 404
