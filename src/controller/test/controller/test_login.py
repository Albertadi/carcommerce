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

@pytest.mark.test_valid_login
def test_valid_login():
    # Precondition 100 samples
    insert_samples()

    # Test user data
    valid_account = {
        "email": "jduggan0@chicagotribune.com",
        "password": "cT7=&Y=\"T8s!w2W"
    }

    with flask_app.app_context():
        # Use api to login with valid user account
        url = "http://localhost:5000/api/login"
        response = requests.post(url, json=valid_account)
        success = json.loads(response.text)["success"]
        assert success == True

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_login
def test_invalid_login():
    # Precondition 100 samples
    insert_samples()

    # Test user data
    invalid_account = {
        "email": "jduggan0@chicagotribune.com",
        "password": "wrongPassword"
    }

    with flask_app.app_context():
        # Use api to login with valid user account
        url = "http://localhost:5000/api/login"
        response = requests.post(url, json=invalid_account)
        success = json.loads(response.text)["success"]
        assert success == False

    # Delete precondition data
    delete_samples()