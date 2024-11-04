from flask import Blueprint, request, jsonify
from src.entity.profile import Profile
from src.entity.user import User
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required

buyers_shortlist_blueprint = Blueprint('buyers_shortlist', __name__)

class BuyersShortlistController:
    @buyers_shortlist_blueprint.route('/api/shortlist/buyers_shortlist', methods=['GET'])
    @permission_required('has_seller_permission')
    def buyers_shortlists():
        try:
            # Get the seller's email from the request
            seller_email = request.args.get('seller_email')

            if not seller_email:
                return jsonify({
                    'success': False,
                    'error': 'Seller email parameter is required'
                }), 400

            # Get the list of buyers who have shortlisted the seller's listings
            buyer_shortlists = Shortlist.get_buyers_shortlists(seller_email)

            # Fetch the user profiles for the buyers
            buyer_profiles = [User.queryUserAccount(entry['email']) for entry in buyer_shortlists]

            # Prepare the response data
            response_data = [{
                'buyer_email': profile.email,
                'buyer_name': f"{profile.first_name} {profile.last_name}",
                'shortlisted_listings': [item for item in buyer_shortlists if item['email'] == profile.email]
            } for profile in buyer_profiles]

            return jsonify({
                'success': True,
                'data': response_data
            }), 200

        except Exception as e:
            return jsonify({
                'success': False,
                'error': str(e)
            }), 500