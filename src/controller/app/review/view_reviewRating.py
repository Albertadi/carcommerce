# # view agent pny sendiri, return detai
# # view review raitng, query table review rating berdasar email dari agent, dikumpulin append jadi list
# # di function pertama ada variable list yg kosong, trs query table review rating berdasar email, return semua review, 
# # dan setiap review direturn di append ke list kosong. Rating sama tp di avg
from flask import Blueprint, request, jsonify
from src.entity.reviewRating import ReviewRating, db
from sqlalchemy import func

view_reviewRating_blueprint = Blueprint('view_reviewRating', __name__)

class ViewReviewRatingController():
    @view_reviewRating_blueprint.route('/api/reviewRating/<agent_email>', methods=['GET'])
    def view_review(agent_email):
        # Query reviews based on the agent's email
        reviews = ReviewRating.query.filter_by(agentEmail=agent_email).all()

        # Check if reviews exist for the agent
        if not reviews:
            return jsonify({'error': 'No reviews found for this agent'}), 404
        
        # Create empty list to store all reviews
        reviews_list = []
        
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
                'reviewerName': review.reviewerName,
                'agentEmail': review.agentEmail  # Change here to reflect agentEmail
            })
        
        # Calculate the average rating
        avg_rating = db.session.query(func.avg(ReviewRating.rating)).filter_by(agentEmail=agent_email).scalar()
        
        # Return the reviews and average rating
        return jsonify({
            'reviews': reviews_list,
            'average_rating': round(avg_rating, 2)
        }), 200
