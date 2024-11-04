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

        reviews_list, avg_rating, status_code = ReviewRating.viewReviewRating(agent_email)
        
        # Return the reviews and average rating
        return jsonify({
            'reviews': reviews_list,
            'average_rating': round(avg_rating, 2)
        }), status_code
