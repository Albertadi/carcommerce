# Libraries
from flask import current_app
from typing_extensions import Self

# Local dependencies
from .sqlalchemy import db

class UserProfile(db.Model):
    __tablename__ = "UserProfile"

    # Attributes
    name = db.Column(db.String(100), nullable=False, primary_key=True)
    description = db.Column(db.String(100), nullable=False, default="Placeholder")
    has_admin_permission = db.Column(db.Boolean(), default=False)
    has_buy_permission = db.Column(db.Boolean(), default=False)
    has_sell_permission = db.Column(db.Boolean(), default=False)
    has_listing_permission = db.Column(db.Boolean(), default=False)

    @classmethod
    def queryUserProfile(cls, profile_name:str) -> Self | None:
        # Query a specific user profile based on parameter profile_name
        # return a User Profile object or None
        return cls.query.filter_by(name=profile_name).one_or_none()
    
    @classmethod
    def queryAllUserProfile(cls) -> list[Self]:
        # Query all user profiles
        # Return list of all User Profile objects
        return cls.query.all()
    
    @classmethod
    def createUserProfile(cls, name:str, description:str = "Placeholder",
                          has_admin_permission: bool = False,
                          has_buy_permission: bool = False,
                          has_sell_permission: bool = False,
                          has_listing_permission: bool = False):
        
        if has_admin_permission:
            return False
        
        if cls.queryUserProfile(name):
            return False

        new_profile = cls(
            name=name,
            description=description,
            has_buy_permission=has_buy_permission,
            has_sell_permission=has_sell_permission,
            has_listing_permission=has_listing_permission
        )

        with current_app.app_context():
            db.session.add(new_profile)
            db.session.commit()

        return True