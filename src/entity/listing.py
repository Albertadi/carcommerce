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

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
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
    location = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

    # Foreign Keys
    agent_email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False)
    agentRelation = db.relationship('User', backref='listings')
