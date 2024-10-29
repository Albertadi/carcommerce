from typing import Optional, List, Self
from datetime import datetime
from .sqlalchemy import db
from .listing import Listing
from .user import User

class Shortlist(db.Model):
    __tablename__ = 'shortlists'

    # Composite primary key using both user_email and listing_id
    user_email = db.Column(db.String(100), db.ForeignKey('users.email'), primary_key=True)
    listing_id = db.Column(db.String(36), db.ForeignKey('listings.id'), primary_key=True)
    date_added = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', backref='shortlists')
    listing = db.relationship('Listing', backref='shortlisted_by')

    def to_dict(self) -> dict:
        """Return a dictionary representation of the shortlist entry."""
        return {
            'user_email': self.user_email,
            'listing_id': self.listing_id,
            'date_added': self.date_added.isoformat(),
            'listing': self.listing.to_dict() if self.listing else None
        }

    @classmethod
    def add_to_shortlist(cls, user_email: str, listing_id: str) -> tuple[bool, int]:
        """Add a listing to user's shortlist."""
        try:
            # Check if user exists
            user = User.queryUserAccount(user_email)
            if not user:
                return False, 404  # User not found

            # Check if listing exists
            listing = Listing.queryListing(listing_id)
            if not listing:
                return False, 404  # Listing not found

            # Check if already in shortlist
            existing = cls.query.filter_by(
                user_email=user_email,
                listing_id=listing_id
            ).first()
            
            if existing:
                return False, 409  # Already in shortlist

            # Create new shortlist entry
            shortlist_entry = cls(
                user_email=user_email,
                listing_id=listing_id
            )

            db.session.add(shortlist_entry)
            db.session.commit()
            return True, 200

        except Exception as e:
            db.session.rollback()
            return False, 500

    @classmethod
    def remove_from_shortlist(cls, user_email: str, listing_id: str) -> tuple[bool, int]:
        """Remove a listing from user's shortlist."""
        try:
            # Check if entry exists
            entry = cls.query.filter_by(
                user_email=user_email,
                listing_id=listing_id
            ).first()
            
            if not entry:
                return False, 404

            db.session.delete(entry)
            db.session.commit()
            return True, 200

        except Exception as e:
            db.session.rollback()
            return False, 500

    @classmethod
    def get_user_shortlist(cls, user_email: str) -> List[dict]:
        """Get all shortlisted listings for a user."""
        shortlist_entries = cls.query.filter_by(user_email=user_email).all()
        return [entry.to_dict() for entry in shortlist_entries]

    @classmethod
    def search_in_shortlist(cls, user_email: str, search_term: str) -> List[dict]:
        """
        Search within a user's shortlisted listings by vehicle make or model.
        The search is case-insensitive and matches partial names.
        
        Args:
            user_email (str): The email of the user whose shortlist to search
            search_term (str): The make or model name to search for
            
        Returns:
            List[dict]: List of matching shortlisted listings
        """
        # Start with base query for user's shortlist
        query = cls.query.filter_by(user_email=user_email).join(Listing)

        # Search in both make and model fields if search term is provided
        if search_term:
            search_term = f"%{search_term}%"  # Add wildcards for partial matching
            query = query.filter(
                db.or_(
                    Listing.make.ilike(search_term),
                    Listing.model.ilike(search_term)
                )
            )

        # Execute query and return results
        shortlist_entries = query.all()
        return [entry.to_dict() for entry in shortlist_entries]