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
            min_price = request.args.get('min_price')
            max_price = request.args.get('max_price')
            
            # Convert price strings to float if they exist
            min_price = float(min_price) if min_price else None
            max_price = float(max_price) if max_price else None
            
            # Call entity method
            search_results = Shortlist.search_in_shortlist(
                email=user_data['email'],
                search_term=search_term,
                min_price=min_price,
                max_price=max_price
            )

            return jsonify(search_results), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500