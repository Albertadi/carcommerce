from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

def admin_required(f):
    @wraps(f)
    @jwt_required()  # This ensures that a valid JWT token is present
    def decorated_function(*args, **kwargs):
        # Get the user's identity from the JWT token
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'Authentication required'}), 401
        
        # Directly check if the user_profile in the token is 'admin'
        if current_user.get('user_profile') != 'admin':
            return jsonify({'error': 'Admin access required', 'current_profile': current_user.get('user_profile')}), 403
        
        return f(*args, **kwargs)
    return decorated_function