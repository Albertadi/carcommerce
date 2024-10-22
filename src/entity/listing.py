from flask import current_app
from typing import Optional
from datetime import datetime
from .sqlalchemy import db
from enum import Enum

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
    mileage = db.Column(db.Integer(), nullable=False)
    transmission = db.Column(db.Enum(TransmissionType), nullable=False)
    fuel_type = db.Column(db.Enum(FuelType), nullable=False)
    is_sold = db.Column(db.Boolean(), nullable=False, default=False)
    listing_date = db.Column(db.Date(), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

    agent_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    agentRelation = db.relationship('User', backref='listings')

    seller_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    sellerRelation = db.relationship('User', backref='listings')

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
    def queryAllListing(cls) -> list[Self]:
        """Query all listings."""
        return cls.query.all()

    @classmethod
    def createListing(cls, id: str,
                      vin: str,
                      make: str,
                      model: str,
                      year: int,
                      price: float = 0.0,
                      mileage: int = 0,
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
            return False

        # Validate transmission and fuel_type as Enums
        try:
            transmission = TransmissionType(transmission)
            fuel_type = FuelType(fuel_type)
        except ValueError:
            return False  # Invalid Enum value

        # Convert string listing_date to date object
        try:
            listing_date = datetime.strptime(listing_date, "%Y-%m-%d").date()
        except ValueError:
            return False  # Invalid date format

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

        return True

    @classmethod
    def updateListing(cls, id: str,
                      vin: Optional[str],
                      make: Optional[str],
                      model: Optional[str],
                      year: Optional[int],
                      price: Optional[float] = 0.0,
                      mileage: Optional[int] = 0,
                      transmission: Optional[str] = "",
                      fuel_type: Optional[str] = "",
                      is_sold: Optional[bool] = False,
                      listing_date: Optional[str] = "",
                      image_url: Optional[str] = "",
                      agent_email: Optional[str] = "",
                      seller_email: Optional[str] = "") -> tuple[bool, int]:
        """Update an existing listing in the database."""
        try:
            # Query the listing
            listing = cls.query.filter_by(id=id).one_or_none()
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
            if listing_date:
                listing.listing_date = datetime.strptime(listing_date, "%Y-%m-%d").date()
            if image_url is not None:
                listing.image_url = image_url
            if agent_email is not None:
                listing.agent_email = agent_email
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
