# Libraries
from werkzeug.security import generate_password_hash, check_password_hash

# Local dependencies
from .sqlalchemy import db

class User(db.Model):
    __tablename__ = 'users'

    email = db.Column(db.String(100), nullable=False, primary_key=True)
    password_hash = db.Column(db.String(128), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    user_profile = db.Column(db.String(100), nullable=False)

    def set_password(self, password):
        """Hash the password before storing it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify the password hash."""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Return a dictionary representation of the user."""
        return {
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'dob': self.dob.isoformat(),
            'user_profile': self.user_profile
        }