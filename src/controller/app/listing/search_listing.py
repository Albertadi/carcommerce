from flask import Blueprint, request, jsonify
from src.entity.listing import Listing
from src.controller.app.authentication.permission_required import permission_required

search_listing_blueprint = Blueprint('search_listing', __name__)

class SearchListingController:
    @search_listing_blueprint.route('/api/listing/search_listing', methods=['POST'])
    @permission_required('has_buy_permission', 'has_sell_permission', 'has_listing_permission')
    def search_listing():
        """Search listings with optional filters."""
        
        # Ensure the request is JSON
        if not request.is_json:
            print("Error: Request format is not JSON")
            return jsonify({"error": "Invalid request format: expected JSON"}), 422

        # Get JSON data from the request
        data = request.get_json()
        print("Received data:", data)  # Log the received data for debugging

        # List of expected fields (some are optional)
        expected_fields = ["make", "model", "year", "min_price", "max_price", "min_mileage", "max_mileage", "transmission", "fuel_type", "is_sold", "seller_email", "agent_email"]
        
        # Check for missing required fields
        missing_fields = [field for field in expected_fields if field not in data and data.get(field) is not None]
        if missing_fields:
            print("Missing fields in request:", missing_fields)
            return jsonify({"error": "Missing required fields", "missing_fields": missing_fields}), 422

<<<<<<< HEAD
        # Extract values from the request
        make = data.get('make')
        model = data.get('model')
        year = data.get('year')
        min_price = data.get('min_price')
        max_price = data.get('max_price')
        min_mileage = data.get('min_mileage')
        max_mileage = data.get('max_mileage')
        transmission = data.get('transmission')
        fuel_type = data.get('fuel_type')
        is_sold = data.get('is_sold')
        seller_email = data.get('seller_email')
        agent_email = data.get('agent_email')

        try:
            listing_list = Listing.searchListing(
                make, model, year, min_price, max_price, min_mileage, max_mileage,
                transmission, fuel_type, is_sold, seller_email, agent_email
            )
            return jsonify({"message": "Success", "listing_list": listing_list}), 200
        except Exception as e:
            print("Error while searching listings:", str(e))
            return jsonify({"error": "An error occurred while searching listings", "details": str(e)}), 500
=======
        listing_list = Listing.searchListing(make, model, year, min_price, max_price, min_mileage, max_mileage, transmission, fuel_type, is_sold, seller_email, agent_email)

        return jsonify({"message": "Success", "listing_list": listing_list})
>>>>>>> db28114b1ead0a1b4b62fb1dd84140322747d2f0
