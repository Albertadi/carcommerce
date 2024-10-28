# Libraries
from flask import current_app
from datetime import datetime, timedelta
from typing_extensions import Self

# Local dependencies
from .sqlalchemy import db
from .user import User

class Suspension(db.Model):
    __tablename__ = 'suspensions'

    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
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
