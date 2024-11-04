# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Suspension
from src.controller.app.authentication.permission_required import permission_required

check_user_suspended_blueprint = Blueprint('check_user_suspended', __name__)

class CheckUserSuspendedController:
    @check_user_suspended_blueprint.route('/api/suspension/check_user', methods=['POST'])
    def check_user_suspended():
        data = request.get_json()
        user_email = data.get('email')

        # Validate input
        if not user_email:
            return jsonify({'success': False, 'message': 'Email is required.'}), 400

        # Call the check_user_suspended method from the Suspension entity
        suspension_info = Suspension.check_user_suspended(user_email)

        if suspension_info['is_suspended']:
            return jsonify({
                'success': True,
                'is_suspended': suspension_info['is_suspended'],
                'message': 'User is currently suspended.',
                'suspension_details': {
                    'start_date': suspension_info['start_date'],
                    'end_date': suspension_info['end_date'],
                    'reason': suspension_info['reason']
                }
            }), 200
        else:
            return jsonify({
                'success': True,
                'is_suspended': suspension_info['is_suspended'],
                'message': 'User is not suspended.'
            }), 200
