# Libraries
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

# Local dependencies
from src.entity import Listing
from src.controller.app.authentication.permission_required import permission_required

class DeleteListingController:
    delete_listing_blueprint = Blueprint('delete_listing', __name__)

    @delete_listing_blueprint.route('/api/listing/delete_listing', methods=['POST'])
    @permission_required('has_listing_permission')
    def delete_listing():
        data = request.get_json()
        listing_id = data["id"]

        delete_response, status_code = Listing.deleteListing(listing_id)

        return jsonify({"success": delete_response, "message": "delete_listing API called"}), status_code