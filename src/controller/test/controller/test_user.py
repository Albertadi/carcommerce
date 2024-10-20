import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

# Libraries
import pytest, requests, json, datetime

# Local dependencies
from src.entity import db, User
from src.controller.app import flask_app
from src.controller.test.insert_delete_samples import insert_samples, delete_samples
from src.controller.test.controller.admintoken import getAdminToken

def test_valid_create():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test user data
    valid_account = {
        "email": "test@test.com",
        "password": "test",
        "first_name": "test",
        "last_name": "test",
        "dob": "2020-11-22",
        "user_profile": "buyer"
    }

    with flask_app.app_context():
        # Use api to insert test user into database /api/users/create_user
        url = "http://localhost:5000/api/users/create_user"
        response = requests.post(url, json=valid_account, headers=headers)
        success = json.loads(response.text)["success"]
        assert success == True

        # Delete test user
        User.query.filter_by(email=valid_account["email"]).delete()
        db.session.commit()

    # Delete precondition data
    delete_samples()