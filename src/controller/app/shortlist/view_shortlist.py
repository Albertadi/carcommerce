from flask import Blueprint, request, jsonify
from src.entity import Shortlist
from src.controller.app.authentication.permission_required import permission_required
from flask_jwt_extended import get_jwt_identity

view_shortlist_blueprint = Blueprint('view_shortlist', __name__)

class ViewShortlistController:
   @view_shortlist_blueprint.route('/api/shortlist/view_shortlist', methods=['GET'])
   @permission_required('has_buy_permission')
   def view_shortlist():
       try:
           # Get user from JWT
           user_data = get_jwt_identity()
           
           # Call entity method
           result = Shortlist.get_user_shortlist(email=user_data['email'])
           
           return jsonify(result), 200

       except Exception as e:
           return jsonify({
               'success': False,
               'error': str(e)
           }), 500