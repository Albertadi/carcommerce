from functools import wraps
from flask import jsonify, request
from src.entity.user import User

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the user ID from the request
        # This assumes you're sending the user ID in a header or token
        user_id = get_user_id_from_request(request)
        
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        
        user = User.query.get(user_id)
        if not user or user.user_profile != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def get_user_id_from_request(request):
    # Implement your logic to extract the user ID from the request
    # This could involve decoding a JWT token, checking session data, etc.
    pass