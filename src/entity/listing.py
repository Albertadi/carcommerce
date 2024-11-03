# Libraries
from typing import Optional, Self
from datetime import datetime
from .sqlalchemy import db
from enum import Enum

# Local dependencies
from .profile import Profile
from .user import User

# Enums for TransmissionType and FuelType
class TransmissionType(str, Enum):
    MANUAL = 'MANUAL'
    AUTOMATIC = 'AUTOMATIC'

class FuelType(str, Enum):
    PETROL = 'PETROL'
    DIESEL = 'DIESEL'
    ELECTRIC = 'ELECTRIC'
    HYBRID = 'HYBRID'

class Listing(db.Model):
    __tablename__ = 'listings'

    # Define attributes
    id = db.Column(db.String(36), primary_key=True)
    vin = db.Column(db.String(17), nullable=False, unique=True)
    make = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer(), nullable=False)
    price = db.Column(db.Float(), nullable=False)
    mileage = db.Column(db.String(100), nullable=False)
    transmission = db.Column(db.Enum(TransmissionType), nullable=False)
    fuel_type = db.Column(db.Enum(FuelType), nullable=False)
    is_sold = db.Column(db.Boolean(), nullable=False, default=False)
    listing_date = db.Column(db.Date(), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    agent_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    seller_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)

    # Foreign key relations
    agentRelation = db.relationship('User', foreign_keys=[agent_email], backref='agent_listings')
    sellerRelation = db.relationship('User', foreign_keys=[seller_email], backref='seller_listings')

    # Methods
    def to_dict(self) -> dict:
        """Return a dictionary representation of the listing."""
        return {
            'id': self.id,
            'vin': self.vin,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'price': self.price,
            'mileage': self.mileage,
            'transmission': self.transmission.value,  # Access the value of the enum
            'fuel_type': self.fuel_type.value,  # Access the value of the enum
            'is_sold': self.is_sold,
            'listing_date': self.listing_date.isoformat(),  # Convert date to string
            'image_url': self.image_url,
            'agent_email': self.agent_email,
            'seller_email': self.seller_email
        }

    @classmethod
    def queryListing(cls, id: str) -> Optional[Self]:
        """Query a listing by ID."""
        return cls.query.filter_by(id=id).one_or_none()

    @classmethod
    def queryAllListing(cls):
        """Query all listings."""
        return cls.query.all()
    
    @classmethod
    def searchListing(cls,
                      make: Optional[str] = None,
                      model: Optional[str] = None,
                      year: Optional[int] = None,
                      min_price: Optional[float] = None,
                      max_price: Optional[float] = None,
                      mileage: Optional[str] = None,
                      transmission: Optional[str] = None,
                      fuel_type: Optional[str] = None,
                      is_sold: Optional[bool] = None,
                      seller_email: Optional[str] = None,
                      agent_email: Optional[str] = None):

        query = Listing.query

        if seller_email:
            query = query.filter(Listing.seller_email.ilike(f'{seller_email}%')) # Case-insensitive partial search
        if agent_email:
            query = query.filter(Listing.agent_email.ilike(f'{agent_email}%')) # Case-insensitive partial search

        # Apply filters dynamically
        if make:
            query = query.filter(Listing.make.ilike(f'{make}%')) # Case-insensitive partial search
        if model:
            query = query.filter(Listing.model.ilike(f'{model}%')) # Case-insensitive partial search
        if year:
            query = query.filter_by(year=year)
        if min_price is not None:
            query = query.filter(Listing.price >= min_price)
        if max_price is not None:
            query = query.filter(Listing.price <= max_price)
        if mileage is not None:
            query = query.filter(Listing.model.ilike(f'{mileage}%'))
        if transmission:
            try:
                transmission_enum = TransmissionType(transmission)
                query = query.filter_by(transmission=transmission_enum)
            except ValueError:
                return []  # Invalid transmission value
        if fuel_type:
            try:
                fuel_type_enum = FuelType(fuel_type)
                query = query.filter_by(fuel_type=fuel_type_enum)
            except ValueError:
                return []  # Invalid fuel type value
        if is_sold is not None:
            query = query.filter_by(is_sold=is_sold)

        # Execute the query and return the filtered users
        listings = query.all()
        listing_list = [listing.to_dict() for listing in listings]

        return listing_list
    
    @classmethod
    def createListing(cls, id: str,
                      vin: str,
                      make: str,
                      model: str,
                      year: int,
                      price: float = 0.0,
                      mileage: str = "",
                      transmission: str = "",
                      fuel_type: str = "",
                      is_sold: bool = False,
                      listing_date: str = "",
                      image_url: str = "",
                      agent_email: str = "",
                      seller_email: str = "") -> bool:
        """Create a new listing in the database."""

        # Check if the listing already exists
        if cls.queryListing(id):
            return False, 409
        
        agent_profile = User.queryUserAccount(agent_email).user_profile
        if not Profile.queryUserProfile(agent_profile).has_listing_permission:
            return False, 403 # Agent does not have listing permission

        seller = User.queryUserAccount(seller_email)
        if not seller:
            return False, 404 # Seller does not exist

        seller_profile = seller.user_profile
        if not Profile.queryUserProfile(seller_profile).has_sell_permission:
            return False, 403 # Seller does not have listing permission
        
        # Validate transmission and fuel_type as Enums
        try:
            transmission = TransmissionType(transmission)
            fuel_type = FuelType(fuel_type)
        except ValueError:
            return False, 400  # Invalid Enum value

        # Convert string listing_date to date object
        try:
            listing_date = datetime.strptime(listing_date, "%Y-%m-%d").date()
        except ValueError:
            return False, 400  # Invalid date format

        # Create new listing
        new_listing = cls(
            id=id,
            vin=vin,
            make=make,
            model=model,
            year=year,
            price=price,
            mileage=mileage,
            transmission=transmission,
            fuel_type=fuel_type,
            is_sold=is_sold,
            listing_date=listing_date,
            image_url=image_url,
            agent_email=agent_email,
            seller_email=seller_email
        )

        # Add the listing to the database
        db.session.add(new_listing)
        db.session.commit()

        return True, 200

    @classmethod
    def updateListing(cls, id: str,
                      vin: Optional[str],
                      make: Optional[str],
                      model: Optional[str],
                      year: Optional[int],
                      price: Optional[float] = 0.0,
                      mileage: Optional[str] = "",
                      transmission: Optional[str] = "",
                      fuel_type: Optional[str] = "",
                      is_sold: Optional[bool] = False,
                      image_url: Optional[str] = "",
                      seller_email: Optional[str] = "") -> tuple[bool, int]:
        """Update an existing listing in the database."""
        try:
            # Query the listing
            listing = cls.queryListing(id)

            if not listing:
                return False, 404

            # Update fields if provided
            if vin is not None:
                listing.vin = vin
            if make is not None:
                listing.make = make
            if model is not None:
                listing.model = model
            if year is not None:
                listing.year = year
            if price is not None:
                listing.price = price
            if mileage is not None:
                listing.mileage = mileage
            if transmission:
                listing.transmission = TransmissionType(transmission)
            if fuel_type:
                listing.fuel_type = FuelType(fuel_type)
            if is_sold is not None:
                listing.is_sold = is_sold
            if image_url is not None:
                listing.image_url = image_url
            if seller_email is not None:
                listing.seller_email = seller_email

            db.session.commit()
            return True, 200

        except ValueError:
            db.session.rollback()
            return False, 400  # Return 400 for bad input (invalid enums or date)
        except Exception as e:
            db.session.rollback()
            return False, 500  # Return 500 for any other server errors
        
    @classmethod
    def deleteListing(cls, id):
        # Ensure listing exists
        listing = cls.queryListing(id)
        if not listing:
            return False, 404
        
        # Delete listing by id
        cls.query.filter_by(id=id).delete()
        db.session.commit()
        
        return True, 200
