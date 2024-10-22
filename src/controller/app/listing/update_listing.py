# Libraries
from flask import Blueprint, request, jsonify

# Local dependencies
from src.entity import db, User, Profile, Listing
from src.controller.app.authentication.permission_required import permission_required

update_listing_blueprint = Blueprint('update_listing', __name__)

@update_listing_blueprint.route('/api/listing/update_listing', methods=['POST'])
@permission_required('has_listing_permission')
def create_listing():
    data = request.get_json()

    id=data.get('id')
    vin=data.get('vin')
    make=data.get('make')
    model=data.get('model')
    year=data.get('year')
    price=data.get('price')
    mileage=data.get('mileage')
    transmission=data.get('transmission')
    fuel_type=data.get('fuel_type')
    is_sold=data.get('is_sold')
    image_url=data.get('image_url')
    seller_email=data.get('seller_email')

    listing = Listing.queryListing(id)
    if listing is None:
        return jsonify({'success': False, 'message': 'listing does not exist'})

    if seller_email:
        seller = User.queryUserAccount(seller_email)
        if not seller:
            return jsonify({'success': False, 'message': 'seller does not exist'})

        seller_profile = seller.user_profile
        if not Profile.queryUserProfile(seller_profile).has_sell_permission:
            return jsonify({'success': False, 'message': 'seller does not have selling permission'})

    create_response = Listing.updateListing(id, vin, make, model, year, price, mileage, transmission, fuel_type, is_sold,
                                            image_url, seller_email)

    return jsonify({'success': create_response, 'message': 'update_listing API called'}), 201