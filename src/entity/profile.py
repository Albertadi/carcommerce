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
    
    def to_dict(self):
        return {
            'name': self.name,
            'description': self.description,
            'has_buy_permission': self.has_buy_permission,
            'has_sell_permission': self.has_sell_permission,
            'has_listing_permission': self.has_listing_permission
        }
    
    @classmethod
    def updateUserProfile(cls, name, description, has_buy_permission, has_sell_permission, has_listing_permission):
        try:
            with current_app.app_context():
                profile = cls.query.get(name)
                if not profile:
                    return False, "Profile not found"

                profile.description = description

                # Ensure only one permission is set to True
                permissions = [has_buy_permission, has_sell_permission, has_listing_permission]
                if sum(permissions) > 1:
                    return False, "A user can only have one type of permission"

                profile.has_buy_permission = has_buy_permission
                profile.has_sell_permission = has_sell_permission
                profile.has_listing_permission = has_listing_permission

                db.session.commit()
                return True, "Profile updated successfully"
        except SQLAlchemyError as e:
            db.session.rollback()
            return False, f"Database error: {str(e)}"
        except Exception as e:
            return False, f"An error occurred: {str(e)}"