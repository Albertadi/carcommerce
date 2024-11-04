from flask import Blueprint, request, jsonify
from src.entity.profile import Profile
from src.entity.user import User
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required
from flask_jwt_extended import get_jwt_identity 

buyers_shortlist_blueprint = Blueprint('buyers_shortlist', __name__)

class BuyersShortlistController:
    @buyers_shortlist_blueprint.route('/api/shortlist/buyers_shortlist', methods=['GET'])
    @permission_required('has_seller_permission')
    def buyers_shortlists():
        try:
            # Get seller email from JWT token
            seller_data = get_jwt_identity()
            seller_email = seller_data['email']

            # Get total count
            result = Shortlist.count_buyerlistings_onshortlist(seller_email)
            
            if not result['success']:
                return jsonify({
                    'success': False,
                    'error': result['error']
                }), 500

            return jsonify(result), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500
