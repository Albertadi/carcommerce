# Libraries
from flask import current_app
from typing_extensions import Self

# Local dependencies
from .sqlalchemy import db

class ReviewRating(db.Model):
    __tablename__ = "reviewRating"

    # Attributes
    id = db.Column(db.Integer(), nullable=False, primary_key=True)
    rating = db.Column(db.Double(100), nullable=False)
    review = db.Column(db.String(100), nullable=False, default="")
    reviewerName = db.Column(db.String(100), nullable=False, default="")
    agentName = db.Column(db.String(100), nullable=False, default="")


    def to_dict(self):
        """Return a dictionary representation of the user."""
        return {
            'id': self.id,
            'rating': self.rating,
            'review': self.review,
            'reviewerName': self.reviewerName,
            'agentName': self.agentName
        }