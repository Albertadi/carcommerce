from typing import Tuple
from src.entity import Shortlist, Listing, User, Profile
from src.controller.app.authentication.permission_required import permission_required
from flask import Blueprint, request, jsonify

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
            note = data.get('note')
            
            user_email = request.user_email  

            # Validate required fields
            if not listing_id:
                return jsonify({"error": "Missing listing_id"}), 400

            # Check if user exists
            user = User.queryUserAccount(user_email)
            if not user:
                return jsonify({"error": "User not found"}), 404

            # Verify user has buyer profile
            user_profile = Profile.queryUserProfile(user.user_profile)
            if not user_profile:
                return jsonify({"error": "User profile not found"}), 404
            
            if not user_profile.has_buy_permission:
                return jsonify({"error": "User does not have buyer permissions"}), 403

            # Check if listing exists and is available
            listing = Listing.queryListing(listing_id)
            if not listing:
                return jsonify({"error": "Listing not found"}), 404
            
            if listing.is_sold:
                return jsonify({"error": "Cannot shortlist a sold vehicle"}), 400

            # Prevent sellers from shortlisting their own vehicles
            if listing.seller_email == user_email:
                return jsonify({"error": "Cannot shortlist your own listing"}), 403

            # Add to shortlist using the Shortlist model
            success, status_code, error_message = Shortlist.add_to_shortlist(
                email=user_email,
                listing_id=listing_id,
                note=note
            )

            if not success:
                return jsonify({"error": error_message or "Failed to add listing to shortlist"}), status_code

            return jsonify({
                "message": "Listing successfully added to shortlist",
                "listing_id": listing_id
            }), 200

        except Exception as e:
            # Log the error here if you have logging configured
            return jsonify({"error": "Internal server error"}), 500