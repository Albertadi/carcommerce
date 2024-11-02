from typing import Tuple
from src.entity import Shortlist, Listing, User, Profile
from src.controller.app.authentication.permission_required import permission_required
from flask import Blueprint, request, jsonify

view_shortlist_blueprint = Blueprint('view_shortlist', __name__)

class ViewShortlistController:
    @view_shortlist_blueprint.route('/api/shortlist/view_shortlist', methods=['GET'])
    def view_shortlist():
        try:
            user_email = request.args.get('email')
            if not user_email:
                return jsonify({
                    'success': False,
                    'error': 'Email parameter is required'
                }), 400

            shortlist = Shortlist.get_user_shortlist(
                email=user_email,
                include_sold=False  # By default, exclude sold vehicles
            )

            return jsonify({
                'success': True,
                'data': shortlist
            }), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500