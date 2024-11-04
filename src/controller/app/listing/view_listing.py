# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

# Local dependencies
from src.entity import Listing
from src.controller.app.authentication.permission_required import permission_required

view_listing_blueprint = Blueprint('view_listing', __name__)

class ViewListingController:
    @view_listing_blueprint.route('/api/listing/view_listing', methods=['GET'])
    @permission_required('has_listing_permission')
    def view_listing():
        # Get listing ID from query parameters
        listing_id = request.args.get("id")

        if not listing_id:
            return jsonify({"error": "Listing ID is required"}), 400

        # Query the listing
        listing = Listing.queryListing(listing_id)

        if listing is None:
            return jsonify({"error": "Listing not found"}), 404

        # Return the listing as a dictionary
        return jsonify(listing.to_dict()), 200
