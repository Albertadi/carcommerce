# Libraries
from flask import current_app
from datetime import datetime, timedelta
from typing_extensions import Self

# Local dependencies
from .sqlalchemy import db
from .user import User

class Suspension(db.Model):
    __tablename__ = 'suspensions'

    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False, primary_key=True)
    start_date = db.Column(db.DateTime, nullable=False, primary_key=True)
    end_date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String(255), nullable=True)

    # Foreign key relationship
    user = db.relationship('User', backref='suspensions')

    @classmethod
    def suspendUser(cls, user_email: str, days: int, reason: str) -> bool:
        user = User.queryUserAccount(user_email)
        if not user:
            return False, 404  # User not found

        if type(days) != int:
            try:
                days = int(days)
            except ValueError:
                print("Error: Could not convert days to an integer.")

        start_date = datetime.now()
        end_date = start_date + timedelta(days=days)

        new_suspension = cls(
            user_email=user_email,
            start_date=start_date,
            end_date=end_date,
            reason=reason
        )

        with current_app.app_context():
            db.session.add(new_suspension)
            db.session.commit()

        return True, 200  # Suspension created successfully
    
    @classmethod
    def suspendProfile(cls, profile: str, days: int, reason: str):
        # Fetch the list of users with the specified profile
        user_list = User.searchUserAccount(None, None, user_profile=profile)
        
        # Check if the result is a list and has users
        if not isinstance(user_list, list) or not user_list:
            return False, 404  # No users found with the specified profile

        # Iterate through each user and suspend their account
        for user in user_list:
            user_email = user.get("email")  # Safely get email
            if user_email:
                success, status_code = cls.suspendUser(user_email, days, reason)
                
                # Optionally, log each suspension result
                if not success:
                    print(f"Failed to suspend {user_email} with status code {status_code}")

        return True, 200  # Return success if all suspensions were processed
    
    @classmethod
    def check_user_suspended(cls, user_email: str) -> dict:
        # Check if the user is suspended
        suspension = cls.query.filter_by(user_email=user_email).first()
        
        if not suspension:
            return {'is_suspended': False}  # User not found or not suspended
        
        # Check if the suspension is still active
        if suspension.end_date > datetime.now():
            return {
                'is_suspended': True,
                'start_date': suspension.start_date.isoformat(),
                'end_date': suspension.end_date.isoformat(),
                'reason': suspension.reason
            }

        return {'is_suspended': False}  # Suspension period has ended
