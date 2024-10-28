from uuid import uuid4
from datetime import datetime
from src.entity import Listing, View, db
from src.controller.app.authentication.permission_required import permission_required

@see_listing_views_blueprint.route('/api/listing/<string:id>/view', methods=['GET'])
@permission_required('has_listing_permision')
def view_listing(id):
    listing = Listing.queryListing(id)
    
    if listing is None:
        return jsonify({'success': False, 'message': 'Listing not found'}), 404

    # Create a new view record
    new_view = View(id=str(uuid4()), listing_id=id, timestamp=datetime.utcnow())
    db.session.add(new_view)
    db.session.commit()

    # Get updated view count
    view_count = View.query.filter_by(listing_id=id).count()
    
    return jsonify({'success': True, 'views': view_count, 'message': 'Listing viewed successfully'}), 200
