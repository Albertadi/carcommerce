# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

# Local dependencies
from src.entity import Listing
from src.controller.app.authentication.permission_required import permission_required

view_listing_blueprint = Blueprint('view_listing', __name__)

@view_listing_blueprint.route('/api/listing/view_listing', methods=['GET'])
@permission_required('has_listing_permission')
def view_listing():
    data = request.get_json()
    listing_id = data["id"]

    listing = Listing.queryListing(listing_id)

    if listing is None:
        jsonify({"error": "Listing not found"}), 404

    return jsonify({listing.to_dict()}), 200