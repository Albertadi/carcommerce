from datetime import datetime
from .sqlalchemy import db

class View(db.Model):
    __tablename__ = 'views'
    
    id = db.Column(db.String(36), primary_key=True)
    listing_id = db.Column(db.String(36), db.ForeignKey('listings.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)  # Optional if tracking users
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (optional)
    listing = db.relationship('Listing', backref='views')
    user = db.relationship('User', backref='views')  # Optional if tracking users
