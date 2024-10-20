# Libraries
import json
import datetime

# Local dependencies
from src.controller.app import flask_app
from src.entity import db, User, Profile #, Suspension

def insert_samples():
    with flask_app.app_context():
        profiles = []
        with open('./test/PROFILES_SAMPLE.json') as f:
            profiles = json.load(f)

        for profile in profiles:
            Profile.createUserProfile(profile.name,
                                      profile.description,
                                      False,
                                      profile.has_buy_permission,
                                      profile.has_sell_permission,
                                      profile.has_listing_permission)
        
        users = []
        with open('./test/USERS_SAMPLE.json') as f:
            users = json.load(f)
        
        for user in users:
            User.createUserAccount(user.email, user.password,
                                   user.first_name, user.last_name,
                                   user.dob, user.user_profile)
            
        # Add suspensions last
            
def delete_samples():
    with flask_app.app_context():
        # Delete suspensions first


        users = []
        with open('./test/USERS_SAMPLE.json') as f:
            users = json.load(f)
        
        for user in users:
            User.query.filter_by(email=user.email).delete()

        profiles = []
        with open('./test/PROFILES_SAMPLE.json') as f:
            profiles = json.load(f)
        
        for profile in profiles:
            Profile.query.filter_by(name=profile.name).delete()
        
        db.session.commit()