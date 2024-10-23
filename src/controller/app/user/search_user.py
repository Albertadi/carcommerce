from flask import Blueprint, request, jsonify
from src.entity.user import User
from src.controller.app.authentication.permission_required import permission_required

search_user_blueprint = Blueprint('search_user', __name__)

@search_user_blueprint.route('/api/users/search_user', methods=['GET'])
@permission_required('has_admin_permission')
def search_user():
    email = request.args.get('email')
    first_name = request.args.get('first_name')
    user_profile = request.args.get('user_profile')

    query = User.query

    # Apply filters dynamically
    if email:
        query = query.filter(User.email.ilike(f'{email}%')) 
    if first_name:
        query = query.filter(User.first_name.ilike(f'{first_name}%')) 
    if user_profile:
        query = query.filter(User.user_profile.ilike(f'{user_profile}'))

    # Execute the query and return the filtered users
    users = query.all()
    account_list = [user.to_dict() for user in users]

    return jsonify({"message": "Success", "account_list": account_list})