# Libraries
from flask import Blueprint, request, jsonify
from src.entity import Views
from src.entity.listing import Listing  # Import Listing entity to validate listing existence

see_listing_views_blueprint = Blueprint('see_listing_views', __name__)

class SeeListingViewsController:
    @see_listing_views_blueprint.route('/api/listing/views', methods=['POST'])
    def increment_and_get_listing_views():
        data = request.get_json()
        listing_id = data.get('listing_id')

        # Validate input
        if not listing_id:
            return jsonify({'success': False, 'message': 'Listing ID is required.'}), 400

        # Check if the listing exists
        listing_exists = Listing.query.get(listing_id)
        if not listing_exists:
            return jsonify({'success': False, 'message': 'Listing not found.'}), 404

        # Increment and retrieve the number of views for the listing
        views_count = Views.increment_and_get_views(listing_id)

        return jsonify({
            'success': True,
            'message': 'Listing views updated successfully.',
            'listing_id': listing_id,
            'views_count': views_count
        }), 200
