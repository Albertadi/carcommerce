import json
import os
from datetime import datetime
from src.controller.app import flask_app
from src.entity import db, User, Profile

def insert_samples():
    current_dir = os.path.dirname(__file__)
    profiles_path = os.path.join(current_dir, 'PROFILES_SAMPLE.json')
    users_path = os.path.join(current_dir, 'USERS_SAMPLE.json')

    with flask_app.app_context():
        # profiles
        with open(profiles_path, 'r') as f:
            profiles = json.load(f)
        for profile in profiles:
            Profile.createUserProfile(
                profile["name"],
                profile["description"],
                False,
                profile["has_buy_permission"],
                profile["has_sell_permission"],
                profile["has_listing_permission"]
            )
        
        # users
        with open(users_path, 'r') as f:
            users = json.load(f)
        for user in users:
            try:
                # Convert dob from string to datetime.date object
                dob = datetime.strptime(user["dob"], "%Y-%m-%d").date()
            except ValueError:
                raise ValueError(f"Invalid date format for user {user['email']}. Use YYYY-MM-DD.")

            User.createUserAccount(
                user["email"],
                user["password"],
                user["first_name"],
                user["last_name"],
                dob,
                user["user_profile"]
            )

        # suspensions


        db.session.commit() 

def delete_samples():
    current_dir = os.path.dirname(__file__)
    profiles_path = os.path.join(current_dir, 'PROFILES_SAMPLE.json')
    users_path = os.path.join(current_dir, 'USERS_SAMPLE.json')

    with flask_app.app_context():
        # users
        with open(users_path, 'r') as f:
            users = json.load(f)
        for user in users:
            User.query.filter_by(email=user["email"]).delete()

        # profiles
        with open(profiles_path, 'r') as f:
            profiles = json.load(f)
        for profile in profiles:
            Profile.query.filter_by(name=profile["name"]).delete()

        # suspensions


        db.session.commit()
