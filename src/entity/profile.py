# Libraries
from flask import current_app
from typing_extensions import Self
from sqlalchemy.exc import SQLAlchemyError

# Local dependencies
from .sqlalchemy import db

class Profile(db.Model):
    __tablename__ = "profiles"

    # Attributes
    name = db.Column(db.String(100), nullable=False, primary_key=True)
    description = db.Column(db.String(100), nullable=False, default="Placeholder")
    has_admin_permission = db.Column(db.Boolean(), default=False)
    has_buy_permission = db.Column(db.Boolean(), default=False)
    has_sell_permission = db.Column(db.Boolean(), default=False)
    has_listing_permission = db.Column(db.Boolean(), default=False)

    def to_dict(self) -> dict:
        """Return a dictionary representation of the profile."""
        return {
            'name': self.name,
            'description': self.description,
            'has_buy_permission': self.has_buy_permission,
            'has_sell_permission': self.has_sell_permission,
            'has_listing_permission': self.has_listing_permission
        }

    @classmethod
    def queryUserProfile(cls, profile_name: str) -> Self | None:
        """Query a specific user profile based on parameter profile_name."""
        return cls.query.filter_by(name=profile_name).one_or_none()

    @classmethod
    def queryAllUserProfiles(cls) -> list[Self]:
        """Query all user profiles."""
        return cls.query.all()

    @classmethod
    def searchUserProfile(cls, name=None, description=None):
        """Search for user profiles based on name and description."""
        query = cls.query
        
        if name:
            query = query.filter(cls.name.ilike(f'%{name}%'))
        
        if description:
            query = query.filter(cls.description.ilike(f'%{description}%'))
        
        profiles = query.all()
        return [profile.to_dict() for profile in profiles]  # Return dictionary representation

    @classmethod
    def createUserProfile(cls, name: str, description: str = "Placeholder",
                          has_admin_permission: bool = False,
                          has_buy_permission: bool = False,
                          has_sell_permission: bool = False,
                          has_listing_permission: bool = False):
        
        if has_admin_permission:
            return False, "Admin profile creation is not allowed."
        
        if cls.queryUserProfile(name):
            return False, 409  # Profile already exists

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

        return True, 201  # Profile created successfully

    @classmethod
    def updateUserProfile(cls, name: str, description: str, 
                          has_buy_permission: bool, 
                          has_sell_permission: bool, 
                          has_listing_permission: bool):
        """Update an existing user profile."""
        try:
            profile = cls.queryUserProfile(name)
            if not profile:
                return False, 404

            profile.description = description
            
            # Ensure only one permission is set to True
            permissions = [has_buy_permission, has_sell_permission, has_listing_permission]
            if sum(permissions) > 1:
                return False, 403

            profile.has_buy_permission = has_buy_permission
            profile.has_sell_permission = has_sell_permission
            profile.has_listing_permission = has_listing_permission

            db.session.commit()
            return True, 200
        except SQLAlchemyError as e:
            db.session.rollback()
            return False, 400
        except Exception as e:
            return False, 500
