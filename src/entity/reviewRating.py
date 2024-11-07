# Libraries
from flask import current_app
from typing_extensions import Self

# Local dependencies
from .sqlalchemy import db
from sqlalchemy import func
from .user import User


class ReviewRating(db.Model):
    __tablename__ = "reviewRating"

    # Attributes
    id = db.Column(db.Integer(), nullable=False, primary_key=True)
    rating = db.Column(db.Double(100), nullable=False)
    review = db.Column(db.String(100), nullable=False, default="")
    reviewerEmail = db.Column(db.String(100), nullable=False, default="")
    agentEmail = db.Column(db.String(100), nullable=False, default="")


    def to_dict(self):
        """Return a dictionary representation of the user."""
        return {
            'id': self.id,
            'rating': self.rating,
            'review': self.review,
            'reviewerEmail': self.reviewerEmail,
            'agentEmail': self.agentEmail
        }
    
    @classmethod
    def viewReviewRating(cls, agent_email):
        # Initialize variables
        reviews_list = []
        avg_rating = 0

        # Query reviews based on the agent's email
        reviews = ReviewRating.query.filter_by(agentEmail=agent_email).all()

        # Check if reviews exist for the agent
        if not reviews:
            return reviews_list, avg_rating, 404
        
        # Loop through all reviews and append them to the list
        for review in reviews:

            if review.review is None:
                review_text = "No review provided"
            else:
                review_text = review.review
            
            # Append the review dictionary with a safe review text
            reviews_list.append({
                'id': review.id,
                'rating': review.rating,
                'review': review_text,
                'reviewerEmail': review.reviewerEmail,
                'agentEmail': review.agentEmail  # Change here to reflect agentEmail
            })
        
        # Calculate the average rating
        avg_rating = db.session.query(func.avg(ReviewRating.rating)).filter_by(agentEmail=agent_email).scalar()

        return avg_rating, reviews_list, 200
    
    @classmethod
    def createReviewRating(cls, rating, review, agent_email, reviewer_email):
            
        # Create a new Review object
        new_reviewRating = cls(rating=rating, review=review, agentEmail = agent_email, reviewerEmail = reviewer_email)

        # Validate agent and reviewer email existence
        if not User.queryUserAccount(agent_email) or not User.queryUserAccount(reviewer_email):
            return False, 404

        # # Save the review to the database
        try:
            db.session.add(new_reviewRating)
            db.session.commit()
        except Exception as e:
            return False, 400

        return True, 200