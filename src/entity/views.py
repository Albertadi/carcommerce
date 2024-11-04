# views.py (entity)
# Libraries
from flask import current_app
from datetime import datetime
from .sqlalchemy import db

class Views(db.Model):
    __tablename__ = 'views'

<<<<<<< HEAD
    # Relationships (optional)
    listing = db.relationship('Listing', backref='views')

    
=======
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, nullable=False, unique=True)
    views_count = db.Column(db.Integer, nullable=False, default=0)
    last_viewed = db.Column(db.DateTime, nullable=True)

    @classmethod
    def increment_and_get_views(cls, listing_id: int) -> int:
        with current_app.app_context():
            # Check if the listing already has views
            view_record = cls.query.filter_by(listing_id=listing_id).one_or_none()

            if view_record:
                # Listing found, increment views
                view_record.views_count += 1
                view_record.last_viewed = datetime.now()
            else:
                # Listing not found, create a new record
                view_record = cls(
                    listing_id=listing_id,
                    views_count=1,
                    last_viewed=datetime.now()
                )
                db.session.add(view_record)

            # Commit changes and return the updated views count
            db.session.commit()
            return view_record.views_count
>>>>>>> 892ffe858fbd7b541574377c57d95f2c9918f6cc
