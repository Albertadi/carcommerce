from flask import Blueprint, request, jsonify
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required
from flask_jwt_extended import get_jwt_identity

search_shortlist_blueprint = Blueprint('search_shortlist', __name__)

class SearchShortlistController:
    @search_shortlist_blueprint.route('/api/shortlist/search_shortlist', methods=['GET'])
    @permission_required('has_buy_permission')
    def search_shortlist():
        try:
            # Get user from JWT and search parameters
            user_data = get_jwt_identity()
            search_term = request.args.get('search')
            mail = user_data['email']
            
            # Call entity method
            search_results = Shortlist.search_in_shortlist(
                email=mail,
                search_term=search_term,
            )

            return jsonify(search_results), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500