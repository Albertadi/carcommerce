from flask import Blueprint, request, jsonify
from src.entity.reviewRating import ReviewRating, db

create_reviewRating_blueprint = Blueprint('create_reviewRating', __name__)
@create_reviewRating_blueprint.route('/api/reviewRating', methods=['POST'])

#cek agent yg mau di review rate ada di user table ga, nanti bikin foreign key

# Create Review
def create_review():
    data = request.get_json()
    rating = data.get('rating')
    review = data.get('review')
    agentName = data.get('agentName')
    reviewerName = data.get('reviewerName')


    # Validate fields
    if not rating or not review:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create a new Review object
    new_reviewRating = ReviewRating(rating=rating, review=review, agentName = agentName, reviewerName = reviewerName)


    # # Save the review to the database
    db.session.add(new_reviewRating)
    db.session.commit()

    # save review to used car agent db? 
    return jsonify({'message': 'Review created successfully', 'review': new_reviewRating.to_dict()}), 201