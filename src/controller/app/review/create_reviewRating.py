from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from src.entity.reviewRating import ReviewRating, db
from src.controller.app.authentication.permission_required import permission_required

create_reviewRating_blueprint = Blueprint('create_reviewRating', __name__)

class CreateReviewRatingController:
    @create_reviewRating_blueprint.route('/api/reviewRating/create_reviewRating', methods=['POST'])

    # Create Review
    @permission_required('has_buy_permission', 'has_sell_permission')
    def create_review():
        data = request.get_json()
        reviewer = get_jwt_identity()

        rating = data.get('rating')
        review = data.get('review')
        agent_email = data.get('agent_email')
        reviewer_email = reviewer['email']

        create_response, status_code = ReviewRating.createReviewRating(rating, review, agent_email, reviewer_email)

        return jsonify({'success': create_response}), status_code