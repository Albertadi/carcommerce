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

@pytest.mark.test_valid_create_user
def test_valid_create_user():
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

@pytest.mark.test_invalid_create_user
def test_invalid_create_user():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test user data
    invalid_account = [
        {
        "email": "test@test.com",
        "password": "test",
        "first_name": "test",
        "last_name": "test",
        "dob": "2020-11-22",
        "user_profile": "admin"
        },
        {
        "email": "test@test.com",
        "password": "test",
        "first_name": "test",
        "last_name": "test",
        "dob": "2020-11-22",
        "user_profile": "unknownProfile"
        }
    ]

    with flask_app.app_context():
        # Use api to insert test user into database /api/users/create_user
        url = "http://localhost:5000/api/users/create_user"
        for account in invalid_account:
            response = requests.post(url, json=account, headers=headers)
            success = json.loads(response.text)["success"]
            assert success == False

    # Delete precondition data
    delete_samples()

@pytest.mark.test_valid_view_user
def test_valid_view_user():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test user data
    valid_account = {"email": "jduggan0@chicagotribune.com"}

    with flask_app.app_context():
        url = "http://localhost:5000/api/users/view_user"
        response = requests.get(url, params=valid_account, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == True

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_view_user
def test_invalid_view_user():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test user data
    invalid_account = {"email": "anonymous@account.com"}

    with flask_app.app_context():
        url = "http://localhost:5000/api/users/view_user"
        response = requests.get(url, params=invalid_account, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == False

    # Delete precondition data
    delete_samples()

@pytest.mark.test_valid_update_user
def test_valid_update_user():
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
        "email": "jduggan0@chicagotribune.com",
        "password": "updatedPassword",
        "first_name": "newFirstName",
        "last_name": "newLastName",
        "dob": "2020-3-11",
        "user_profile": "used car agent"
    }

    with flask_app.app_context():
        url = "http://localhost:5000/api/users/update_user"
        response = requests.post(url, json=valid_account, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == True

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_update_user
def test_invalid_update_user():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test user data
    invalid_account = [
        {
        "email": "hehehehe@heheheh.com",
        "password": "updatedPassword",
        "first_name": "newFirstName",
        "last_name": "newLastName",
        "dob": "2020-3-11",
        "user_profile": "admin"
        },
        {
        "email": "jduggan0@chicagotribune.com",
        "password": "updatedPassword",
        "first_name": "newFirstName",
        "last_name": "newLastName",
        "dob": "2020-3-11",
        "user_profile": "admin"
        },
        {
        "email": "jduggan0@chicagotribune.com",
        "password": "updatedPassword",
        "first_name": "newFirstName",
        "last_name": "newLastName",
        "dob": "2020-3-11",
        "user_profile": "unknownProfile"
        }
    ]

    with flask_app.app_context():
        url = "http://localhost:5000/api/users/update_user"
        for account in invalid_account:
            response = requests.post(url, json=account, headers=headers)

            success = json.loads(response.text)["success"]
            assert success == False

    # Delete precondition data
    delete_samples()

@pytest.mark.test_search_user
def test_search_user():
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
        "email": "jduggan0@chicagotribune.com",
        "first_name": "Jenine",
        "user_profile": "seller"
    }

    with flask_app.app_context():
        url = "http://localhost:5000/api/users/search_user"
        response = requests.post(url, json=valid_account, headers=headers)

        success = json.loads(response.text)["success"]
        account_list = json.loads(response.text)["account_list"]
        assert success == True
        user_details = ["email", "first_name", "last_name", "dob", "user_profile"]

        for detail in user_details:
            assert type(account_list[0][detail]) == str

    # Delete precondition data
    delete_samples()