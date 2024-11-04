from typing import Optional, List
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from .sqlalchemy import db
from .listing import Listing
from .user import User
from .profile import Profile

class Shortlist(db.Model):
    """
    Represents a user's shortlisted vehicle listings.
    Uses a composite primary key of user email and listing ID.
    """
    __tablename__ = 'shortlist'

    # Composite primary key columns
    email = db.Column(db.String(100), db.ForeignKey('users.email', ondelete='CASCADE'), primary_key=True)
    listing_id = db.Column(db.String(36), db.ForeignKey('listings.id', ondelete='CASCADE'), primary_key=True)
    seller_email = db.Column(db.String(100), db.ForeignKey('users.email', ondelete = 'CASCADE'), primary_key=True)
    # Metadata
    date_added = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)
    
    # Relationships with cascade delete
    user = db.relationship(
        'User',
        backref=db.backref('shortlists', cascade='all, delete-orphan', lazy='dynamic'),
        lazy='joined'
    )
    listing = db.relationship(
        'Listing',
        backref=db.backref('shortlisted_by', cascade='all, delete-orphan', lazy='dynamic'),
        lazy='joined'
    )

    def to_dict(self) -> dict:
        """Return a dictionary representation of the shortlist entry."""
        return {
            'listing_id': self.listing_id,
            'date_added': self.date_added.isoformat(),
            'note': self.note,
            'listing': self.listing.to_dict() if self.listing else None
        }

    @classmethod
    def add_to_shortlist(cls, email: str, listing_id: str, note: Optional[str] = None) -> tuple[bool, int, Optional[str]]:
        """
        Add a listing to user's shortlist.
        
        Returns:
            tuple: (success, status_code, error_message)
        """
        try:
            # Check if user exists and has buyer permissions
            user = User.queryUserAccount(email)
            if not user:
                return False, 404, "User not found"
                
            # Verify user has buyer profile
            profile = Profile.queryUserProfile(user.user_profile)
            if not profile or not profile.has_buy_permission:
                return False, 403, "User does not have buyer permissions"

            # Check if listing exists and is not sold
            listing = Listing.queryListing(listing_id)
            if not listing:
                return False, 404, "Listing not found"
            if listing.is_sold:
                return False, 400, "Cannot shortlist a sold vehicle"
                
            # Prevent sellers from shortlisting their own vehicles
            if listing.seller_email == email:
                return False, 403, "Sellers cannot shortlist their own vehicles"

            # Check if already in shortlist
            existing = cls.query.filter_by(
                email=email,
                listing_id=listing_id
            ).first()
            
            if existing:
                return False, 409, "Already in shortlist"

            # Create new shortlist entry
            shortlist_entry = cls(
                email=email,
                listing_id=listing_id,
                note=note
            )

            db.session.add(shortlist_entry)
            db.session.commit()
            return True, 200, None

        except Exception as e:
            db.session.rollback()
            return False, 500, str(e)

    @classmethod
    def get_user_shortlist(cls, email: str, include_sold: bool = False) -> List[dict]:
        """
        Get all shortlisted listings for a user.
        
        Args:
            email: User's email
            include_sold: Whether to include sold vehicles in results
        """
        query = cls.query.filter_by(email=email)
        
        if not include_sold:
            query = query.join(Listing).filter(Listing.is_sold == False)
            
        shortlist_entries = query.order_by(cls.date_added.desc()).all()
        return [entry.to_dict() for entry in shortlist_entries]

    @classmethod
    def search_in_shortlist(
        cls,
        email: str,
        search_term: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        include_sold: bool = False
    ) -> List[dict]:
        """
        Search within a user's shortlisted listings with various filters.
        
        Args:
            email: User's email
            search_term: Term to search in make/model (case-insensitive)
            min_price: Minimum price filter
            max_price: Maximum price filter
            include_sold: Whether to include sold vehicles
        """
        query = cls.query.filter_by(email=email).join(Listing)

        # Apply filters
        if search_term:
            search_term = f"%{search_term}%"
            query = query.filter(
                db.or_(
                    Listing.make.ilike(search_term),
                    Listing.model.ilike(search_term)
                )
            )
            
        if min_price is not None:
            query = query.filter(Listing.price >= min_price)
            
        if max_price is not None:
            query = query.filter(Listing.price <= max_price)
            
        if not include_sold:
            query = query.filter(Listing.is_sold == False)

        # Execute query and return results
        shortlist_entries = query.order_by(cls.date_added.desc()).all()
        return [entry.to_dict() for entry in shortlist_entries]
    
    @classmethod
    def count_buyerlistings_onshortlist(cls, seller_email: str) -> dict:
        """
        Get total count of shortlists for a seller's listings.
        
        Args:
            seller_email: The seller's email
            
        Returns:
            dict: Count of total shortlists for the seller
        """
        try:
            # Count total shortlists where seller_email matches
            total_shortlists = cls.query.filter_by(seller_email=seller_email).count()
                
            return {
                'success': True,
                'total_shortlists': total_shortlists
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }