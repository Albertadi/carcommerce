# Libraries
from flask import current_app
from typing_extensions import Self
from enum import Enum

# Local dependencies
from .sqlalchemy import db

class TransmissionType(str, Enum):
    MANUAL = 'MANUAL'
    AUTOMATIC = 'AUTOMATIC'

class FuelType(str, Enum):
    PETROL = 'PETROL'
    DIESEL = 'DIESEL'
    ELECTRIC = 'ELECTRIC'
    HYBRID = 'HYBRID'

class Listings(db.Model):
    __tablename__ = 'listings'

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

    # Foreign Keys
    agent_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    agentRelation = db.relationship('User', backref='listings')

    # Methods
    def to_dict(self) -> dict[Self]:
        """Return a dictionary representation of the user."""
        return {
            'id': self.id,
            'vin': self.vin,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'price': self.price,
            'mileage': self.mileage,
            'transmission': self.transmission,
            'fuel_type': self.fuel_type,
            'is_sold': self.is_sold,
            'listing_date': self.listing_date,
            'image_url': self.image_url,
            'agent_email': self.agent_email
        }
    
    @classmethod
    def queryListing(cls, id:str) -> Self | None:
        # Query a specific user profile based on parameter email
        # return a User object or None
        return cls.query.filter_by(id=id).one_or_none()
    
    @classmethod
    def queryAllListing(cls) -> list[Self]:
        # Query all users
        # Return list of all User objects
        return cls.query.all()
    
    @classmethod
    def createListing(cls, id,
                          vin,
                          make,
                          model,
                          year,
                          price:float = 0.0,
                          mileage:int = 0,
                          transmission:str = "",
                          fuel_type:str = "",
                          is_sold:bool=False,
                          listing_date:str="",
                          image_url:str="",
                          agent_email:str=""
                          ):
        
        if cls.queryListing(id):
            return False

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
        )

        with current_app.app_context():
            db.session.add(new_listing)
            db.session.commit()

        return True

    @classmethod
    def updateListing(cls, email, password, first_name, last_name, dob, user_profile):
        try:
            with current_app.app_context():
                user = cls.query.filter_by(email=email).one_or_none()
                if not user:
                    return False, 404
                
                if password is not None:
                    user.password = password
                if first_name is not None:
                    user.first_name = first_name
                if last_name is not None:
                    user.last_name = last_name
                if dob is not None:
                    user.dob = dob
                if user_profile is not None:
                    user.user_profile = user_profile

                db.session.commit()
                return True, 200

        except Exception as e:
            db.session.rollback()
            return False, 500