from flask import Blueprint, request, jsonify
from src.entity.reviewRating import ReviewRating, db

create_reviewRating_blueprint = Blueprint('create_reviewRating', __name__)
@create_reviewRating_blueprint.route('/api/reviewRating/create_reviewRating', methods=['POST'])

#cek agent yg mau di review rate ada di user table ga, nanti bikin foreign key

# Create Review
def create_review():
    data = request.get_json()
    rating = data.get('rating')
    review = data.get('review')
    agent_email = data.get('agent_email')
    reviewer_email = data.get('reviewer_email')

    create_response, status_code = ReviewRating.createReviewRating(rating, review, agent_email, reviewer_email)

    return jsonify({'success': create_response}), status_code