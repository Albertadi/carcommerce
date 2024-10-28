# Libraries
from uuid import uuid4
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

# Local dependencies
from src.entity import db, User, Profile, Listing
from src.controller.app.authentication.permission_required import permission_required

create_listing_blueprint = Blueprint('create_listing', __name__)

class CreateListingController:
    @create_listing_blueprint.route('/api/listing/create_listing', methods=['POST'])
    @permission_required('has_listing_permission')
    def create_listing():
        data = request.get_json()
        agent = get_jwt_identity()

        current_date = datetime.today().strftime('%Y-%m-%d')

        id=str(uuid4()) # Generate random uuid14 36-character id
        vin=data.get('vin')
        make=data.get('make')
        model=data.get('model')
        year=data.get('year')
        price=data.get('price')
        mileage=data.get('mileage')
        transmission=data.get('transmission')
        fuel_type=data.get('fuel_type')
        is_sold=data.get('is_sold')
        listing_date=current_date # Use today's date as the listing date
        image_url=data.get('image_url')
        agent_email=agent['email'] # Access the agent's email from the access_token
        seller_email=data.get('seller_email')

        create_response = Listing.createListing(id, vin, make, model, year, price, mileage, transmission, fuel_type, is_sold, listing_date,
                                                image_url, agent_email, seller_email)

        return jsonify({'success': create_response, 'message': 'create_listing API called'}), 201