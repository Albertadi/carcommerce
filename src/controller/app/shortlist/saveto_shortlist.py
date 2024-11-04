from typing import Tuple
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity

saveto_shortlist_blueprint = Blueprint('saveto_shortlist', __name__)

class SaveToShortlistController:
    @staticmethod
    @saveto_shortlist_blueprint.route('/api/shortlist/saveto_shortlist', methods=['POST'])
    @permission_required('has_buy_permission')
    def save_listing_to_shortlists():
        try:
            # Get data from request
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            # Extract listing_id and optional note from request
            listing_id = data.get('listing_id')
            user_email = data.get('email')
            seller_email = data.get('seller_email')

            # Add to shortlist using the Shortlist model
            success, status_code, error_message = Shortlist.add_to_shortlist(
                email=user_email,
                listing_id=listing_id,
                seller_email=seller_email
            )

            if not success:
                return jsonify({"error": error_message or "Failed to add listing to shortlist"}), status_code

            return jsonify({
                "message": "Listing successfully added to shortlist",
                "listing_id": listing_id
            }), 200

        except Exception as e:
            # Log the error here if you have logging configured
            return jsonify({"error": str(e)}), 500