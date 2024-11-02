from datetime import datetime
from .sqlalchemy import db

class View(db.Model):
    __tablename__ = 'views'
    
    id = db.Column(db.String(36), primary_key=True)
    listing_id = db.Column(db.String(36), db.ForeignKey('listings.id'), nullable=False)
    num_of_views = db.Column(db.Integer(), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships (optional)
    listing = db.relationship('Listing', backref='views')
