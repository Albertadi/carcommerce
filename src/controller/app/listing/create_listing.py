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
        try:
            agent_info = get_jwt_identity()  # Get the current user's info
            agent_email = agent_info['email']  # Extract the email from the user info
            current_date = datetime.now().date()  # Get the current date
            
            # Check if file exists
            file = request.files.get('image')
            if not file:
                print("No image file provided in request.files")
                return jsonify({'success': False, 'message': 'No image file provided'}), 400

            # Validate file type
            if file.mimetype not in ['image/png', 'image/jpeg', 'image/jpg']:
                print("Invalid file type:", file.mimetype)
                return jsonify({'success': False, 'message': 'Invalid file type. Only PNG and JPEG are allowed.'}), 400

            # Get form data and validate required fields
            data = request.form
            required_fields = ['vin', 'make', 'model', 'year', 'price', 'mileage', 'transmission', 'fuel_type', 'seller_email']
            for field in required_fields:
                if field not in data or not data[field]:
                    print(f"Missing required field: {field}")
                    return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400
            
            # Validate year, price, and mileage as integers
            try:
                year = int(data['year'])
                price = float(data['price'])
                mileage = int(data['mileage'])
            except ValueError as ve:
                print(f"Value error: {str(ve)}")
                return jsonify({'success': False, 'message': 'Year, price, and mileage must be valid numbers.'}), 400

            # Generate a new UUID for the listing ID
            listing_id = str(uuid4())

            # Prepare the new listing
            new_listing = Listing(
                id=listing_id,
                vin=data['vin'],
                make=data['make'],
                model=data['model'],
                year=year,
                price=price,
                mileage=mileage,
                transmission=data['transmission'],
                fuel_type=data['fuel_type'],
                is_sold=False,  # Default value
                listing_date=current_date,  # Use the current date
                image_url='',  # Placeholder for the image URL
                agent_email=agent_email,  # Use the extracted email here
                seller_email=data['seller_email']
            )

            # Save the image and update the image_url if needed
            image_filename = f"{listing_id}.jpg"  # Or any appropriate extension
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_filename)
            file.save(image_path)
            new_listing.image_url = image_filename  # Update the listing with the saved image URL

            # Add the new listing to the database
            db.session.add(new_listing)
            db.session.commit()

            return jsonify({'success': True, 'message': 'Listing created successfully'}), 201

        except Exception as e:
            print(f"Error in create_listing: {str(e)}")
            db.session.rollback()  # Rollback if there is an error
            return jsonify({'success': False, 'message': f'Error creating listing: {str(e)}'}), 500
