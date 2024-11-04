# Libraries
from uuid import uuid4
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import os

# Local dependencies
from src.entity import db, Listing
from src.controller.app.authentication.permission_required import permission_required

create_listing_blueprint = Blueprint('create_listing', __name__)

class CreateListingController:
    @create_listing_blueprint.route('/api/listing/create_listing', methods=['POST'])
    @permission_required('has_listing_permission')
    def create_listing():
        agent = get_jwt_identity()
        current_date = datetime.today().strftime('%Y-%m-%d')
        
        # Handle file upload
        file = request.files.get('image')
        if not file:
            return jsonify({'success': False, 'message': 'No image file provided'}), 400

        # File type validation
        if file.mimetype not in ['image/png', 'image/jpeg', 'image/jpg']:
            return jsonify({'success': False, 'message': 'Invalid file type. Only PNG and JPEG are allowed.'}), 400

        # Generate a unique filename with the correct extension
        extension = file.filename.split('.')[-1]  # Get the file extension
        if extension not in ['png', 'jpg', 'jpeg']:
            return jsonify({'success': False, 'message': 'Invalid file type. Only PNG and JPEG are allowed.'}), 400
            
        image_filename = f"{uuid4()}.{extension}"
        image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)

        # Save the uploaded file
        file.save(image_path)
        image_url = f"/uploads/{image_filename}" 

        # Extract other data
        data = request.form 
        vin = data.get('vin')
        make = data.get('make')
        model = data.get('model')
        year = data.get('year')
        price = data.get('price')
        mileage = data.get('mileage')
        transmission = data.get('transmission')
        fuel_type = data.get('fuel_type')
        is_sold = data.get('is_sold')
        seller_email = data.get('seller_email')

        create_response = Listing.createListing(
            id=str(uuid4()),  # Generate UUID for the listing
            vin=vin,
            make=make,
            model=model,
            year=year,
            price=price,
            mileage=mileage,
            transmission=transmission,
            fuel_type=fuel_type,
            is_sold=is_sold,
            listing_date=current_date,
            image_url=image_url,
            agent_email=agent['email'], #Use agent email from jwt token
            seller_email=seller_email
        )

        return jsonify({'success': create_response, 'message': 'create_listing API called'}), 201