from flask import Blueprint, request, jsonify
from datetime import datetime
from src.entity import db, User, Listing
from controller.app.authentication.permission_required import permission_required

create_user_blueprint = Blueprint('create_user', __name__)

@create_user_blueprint.route('/api/users/create_user', methods=['POST'])

@permission_required('has_admin_permission')
def create_user():
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
    listing_date=data.get('listing_date')
    image_url=data.get('image_url')
    agent_email=data.get('agent_email')
    seller_email=data.get('seller_email')