# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Views
from src.entity.listing import Listing  # Import Listing entity to validate listing existence

increment_views_blueprint = Blueprint('increment_views', __name__)

class IncrementViewsController:
    @increment_views_blueprint.route('/api/views/increment_views', methods=['POST'])
    def increment_views():
        data = request.get_json()
        listing_id = data.get('listing_id')

        # Increment and retrieve the number of views for the listing
        views_count = Views.increment_views(listing_id)

        return jsonify({
            'success': True,
            'listing_id': listing_id,
            'views_count': views_count
        }), 200
