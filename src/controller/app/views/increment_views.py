# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Views

increment_views_blueprint = Blueprint('increment_views', __name__)

class IncrementViewsController:
    @increment_views_blueprint.route('/api/views/increment_views', methods=['POST'])
    def increment_views():
        data = request.get_json()
        listing_id = data.get('listing_id')

        # Increment and retrieve the number of views for the listing
        increment_views_response, status_code = Views.increment_views(listing_id)

        return jsonify({
            'success': increment_views_response
        }), status_code
