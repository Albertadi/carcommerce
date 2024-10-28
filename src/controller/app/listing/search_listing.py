# Libraries
from flask import Blueprint, request, jsonify

from src.entity.listing import Listing
from src.controller.app.authentication.permission_required import permission_required


search_listing_blueprint = Blueprint('search_listing', __name__)

class SearchListingController:
    @search_listing_blueprint.route('/api/listing/search_listing', methods=['GET'])

    @permission_required('has_buy_permission')
    def search_listing() -> list[Listing]:
        """Search listings with optional filters."""
        data = request.get_json()

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

        account_list = Listing.searchListing(make, model, year, min_price, max_price, min_mileage, max_mileage, transmission, fuel_type, is_sold)

        return jsonify({"message": "Success", "account_list": account_list})

