from flask import Blueprint, request, jsonify
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required
from flask_jwt_extended import get_jwt_identity 

see_num_car_shortlist_blueprint = Blueprint('see_num_car_shortlist', __name__)

class SeeNumCarShortlistController:
    @see_num_car_shortlist_blueprint.route('/api/shortlist/see_num_car_shortlist', methods=['GET'])
    @permission_required('has_seller_permission')
    def see_num_car_shortlist():
        try:
            # Get seller email from JWT token
            seller_data = get_jwt_identity()
            seller_email = seller_data['email']
            
            # Get listing_id from query parameters (if provided)
            listing_id = request.args.get('listing_id')

            # Get total count from Shortlist entity, with optional listing_id
            result = Shortlist.count_buyerlistings_onshortlist(seller_email, listing_id)
            
            return jsonify(result), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500
