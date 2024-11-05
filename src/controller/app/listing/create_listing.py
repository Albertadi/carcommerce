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
            agent = get_jwt_identity()
            current_date = datetime.today().strftime('%Y-%m-%d')
            
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

            # If validation passed, proceed with file save and database entry
            # (existing code here to handle file save and database entry)
            
            return jsonify({'success': True, 'message': 'Listing created successfully'}), 201

        except Exception as e:
            print(f"Error in create_listing: {str(e)}")
            return jsonify({'success': False, 'message': f'Error creating listing: {str(e)}'}), 500
