# Libraries
from typing_extensions import Self
from flask_jwt_extended import create_access_token

# Local dependencies
from .sqlalchemy import db
from .profile import Profile
from .user import User

class Token(db.Model):
    __tablename__ = 'tokens'

    email = db.Column(db.String(100), db.ForeignKey('users.email'), nullable=False, primary_key=True)
    access_token = db.Column(db.String(512), nullable=False)
    
    # Foreign key
    emailRelationship = db.relationship('User', backref='tokens')

    @classmethod
    def queryAccessToken(cls, email):
        token = cls.query.filter_by(email=email).one_or_none()
        if token:
            return token.access_token
        else:
            return None

    @classmethod
    def generateAccessToken(cls, user):
        profile = Profile.queryUserProfile(user.user_profile)

        access_token = create_access_token(identity={'email': user.email, 'user_profile': user.user_profile,
                                            'has_admin_permission': profile.has_admin_permission,
                                            'has_buy_permission': profile.has_buy_permission,
                                            'has_sell_permission': profile.has_sell_permission,
                                            'has_listing_permission': profile.has_listing_permission})
        
        return access_token

    @classmethod
    def renewAccessToken(cls, user):
        new_token = cls.generateAccessToken(user)
        token_record = cls.query.filter_by(email=user.email).one_or_none()
        
        if token_record:
            token_record.access_token = new_token
            db.session.commit()
            return True, new_token
        
        return False, ""



    @classmethod
    def createAccessToken(cls, email):
        user = User.queryUserAccount(email)

        if not User:
            return False, ""

        # If token record does not exist for the user, generate a token record 
        if not cls.queryAccessToken(user.email):
            new_token = cls(
                email = user.email,
                access_token = cls.generateAccessToken(user)
            )
            db.session.add(new_token)
            db.session.commit()

            return True, new_token.access_token
        else:
            # If a token record exists, renew the token
            return cls.renewAccessToken(user)
        
