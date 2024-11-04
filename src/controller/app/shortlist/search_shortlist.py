from typing import Tuple
from src.entity import Shortlist, Listing, User, Profile
from src.controller.app.authentication.permission_required import permission_required
from flask import Blueprint, request, jsonify

search_shortlist_blueprint = Blueprint('search_shortlist', __name__)

class SearchShortlistController:
    @search_shortlist_blueprint.route('/api/shortlist/search_shortlist', methods=['GET'])
    @permission_required('has_buy_permission')
    def search_shortlist():
        try:
            # Get required parameters
            user_email = request.args.get('email')
            search_term = request.args.get('search')

            # Validate required parameters
            if not user_email:
                return jsonify({
                    'success': False,
                    'error': 'Email parameter is required'
                }), 400

            if not search_term:
                return jsonify({
                    'success': False,
                    'error': 'Search term is required'
                }), 400

            # Search in user's shortlist using the search_in_shortlist method
            search_results = Shortlist.search_in_shortlist(
                email=user_email,
                search_term=search_term,
                include_sold=False  # Exclude sold vehicles by default
            )

            return jsonify({
                'success': True,
                'data': search_results
            }), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500