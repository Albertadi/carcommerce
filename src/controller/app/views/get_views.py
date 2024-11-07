# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Views

get_views_blueprint = Blueprint('get_views', __name__)

class GetViewsController:
    @get_views_blueprint.route('/api/views/get_views', methods=['POST'])
    def increment_and_get_listing_views():
        data = request.get_json()
        listing_id = data.get('listing_id')

        # Increment and retrieve the number of views for the listing
        views_count = Views.getViews(listing_id)

        return jsonify({
            'success': True,
            'views_count': views_count
        }), 200
