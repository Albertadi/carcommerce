# Libraries
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

# Local dependencies
from .sqlalchemy import db

class User(db.Model):
    __tablename__ = 'users'

    email = db.Column(db.String(100), nullable=False, primary_key=True)
    password = db.Column(db.String(128), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    user_profile = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        """Hash the password before storing it."""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Verify the password hash."""
        return check_password_hash(self.password, password)

    def to_dict(self):
        """Return a dictionary representation of the user."""
        return {
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'dob': self.dob.isoformat(),
            'user_profile': self.user_profile
        }

    @classmethod
    def updateUserAccount(cls, email, password, first_name, last_name, dob, user_profile):
        try:
            with current_app.app_context():
                user = cls.query.filter_by(email=email).one_or_none()
                if not user:
                    return {"error": "User not found"}, 404
                
                if password is not None:
                    user.password = generate_password_hash(password)
                if first_name is not None:
                    user.first_name = first_name
                if last_name is not None:
                    user.last_name = last_name
                if dob is not None:
                    user.dob = dob
                if user_profile is not None:
                    user.user_profile = user_profile

                db.session.commit()
                return{"message": "User account updated successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500