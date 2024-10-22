from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

def permission_required(*permissions):
    """Decorator to check if the current user has at least one of the required permissions."""
    
    def decorator(f):  # 'f' is the function being decorated
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'Authentication required'}), 401
            
            # Check if the user has at least one of the required permissions
            if not any(current_user.get(permission) for permission in permissions):
                return jsonify({
                    'error': f'At least one of the following permissions is required: {permissions}',
                    'current_permissions': current_user
                }), 403
            
            return f(*args, **kwargs)  # Call the original function
        
        return decorated_function
    
    return decorator
