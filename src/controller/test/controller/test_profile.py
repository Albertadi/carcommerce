import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../..')))

# Libraries
import pytest, requests, json, datetime

# Local dependencies
from src.entity import db, Profile
from src.controller.app import flask_app
from src.controller.test.insert_delete_samples import insert_samples, delete_samples
from src.controller.test.controller.admintoken import getAdminToken

@pytest.mark.test_valid_create_profile
def test_valid_create_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    valid_profile = {
        "name": "testProfile",
        "description": "this should not appear in the database",
        "has_buy_permission": 1,
        "has_sell_permission": 0,
        "has_listing_permission": 0
    }

    with flask_app.app_context():
        # Use api to insert test profile into database /api/profiles/create_profile
        url = "http://localhost:5000/api/profiles/create_profile"
        response = requests.post(url, json=valid_profile, headers=headers)
        success = json.loads(response.text)["success"]
        assert success == True

        # Delete test profile
        Profile.query.filter_by(name=valid_profile["name"]).delete()
        db.session.commit()

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_create_profile
def test_invalid_create_profile():
    # Precondition: Insert 100 samples
    insert_samples()

    # Insert admin token into headers
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # Test profile data for invalid creation
    invalid_profile = [
        {
            "name": "testProfile", "description": "profile for testing",
            "has_buy_permission": 0
        },
        {
            "name": "buyer", "description": "already existing profile",
            "has_buy_permission": 0,
            "has_sell_permission": 1,
            "has_listing_permission": 0
        }
    ]

    with flask_app.app_context():
        # Use API to attempt creating an invalid profile
        url = "http://localhost:5000/api/profiles/create_profile"
        for profile in invalid_profile:
            response = requests.post(url, json=profile, headers=headers)
            
            # Parse the response
            response_data = response.json()
            success = response_data.get("success")
            
            # Assert that the profile creation was unsuccessful
            assert success == False

    # Clean up precondition data
    delete_samples()

@pytest.mark.test_valid_view_profile
def test_valid_view_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    valid_profile = {"name": "buyer"}

    with flask_app.app_context():
        url = "http://localhost:5000/api/profiles/view_profile"
        response = requests.get(url, params=valid_profile, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == True

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_view_profile
def test_invalid_view_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    invalid_profile = {"name": "pompompurin"}

    with flask_app.app_context():
        url = "http://localhost:5000/api/profiles/view_profile"
        response = requests.get(url, params=invalid_profile, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == False

    # Delete precondition data
    delete_samples()

@pytest.mark.test_valid_update_profile
def test_valid_update_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    valid_profile = {
        "name": "buyer",
        "description": "buyer can now sell",
        "has_buy_permission": 0,
        "has_sell_permission": 1,
        "has_listing_permission": 0
    }

    with flask_app.app_context():
        url = "http://localhost:5000/api/profiles/update_profile"
        response = requests.post(url, json=valid_profile, headers=headers)

        success = json.loads(response.text)["success"]
        assert success == True

    # Delete precondition data
    delete_samples()

@pytest.mark.test_invalid_update_profile
def test_invalid_update_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    invalid_profile = [
        {
            "name": "superProfile",
            "description": "look at me, i am the admin now",
            "has_buy_permission": 1,
            "has_sell_permission": 1,
            "has_listing_permission": 1
        },
        {
            "name": "chicken",
            "description": "chicken",
            "has_buy_permission": 0,
            "has_sell_permission": 1,
            "has_listing_permission": 0
        }
    ]

    with flask_app.app_context():
        url = "http://localhost:5000/api/profiles/update_profile"
        for profile in invalid_profile:
            response = requests.post(url, json=profile, headers=headers)

            success = json.loads(response.text)["success"]
            assert success == False

    # Delete precondition data
    delete_samples()

@pytest.mark.test_search_profile
def test_search_profile():
    # Precondition 100 samples
    insert_samples()

    # Insert admin token into header
    adminToken = getAdminToken()
    headers = {
        "Authorization": f"Bearer {adminToken}",
        "Content-Type": "application/json"
    }

    # test profile data
    valid_profile = {
        "name": "buy"
    }

    with flask_app.app_context():
        url = "http://localhost:5000/api/profiles/search_profile"
        response = requests.post(url, json=valid_profile, headers=headers)
        response_data = response.json()
        success = response_data.get("success")
        profile_list = response_data.get("profile_list", [])

        assert success == True
        profile_details = {"name": str, "description": str, "has_buy_permission": bool, "has_sell_permission": bool, "has_listing_permission": bool}

        for detail, expected_type in profile_details.items():
            assert isinstance(profile_list[0][detail], expected_type), f"Expected {detail} to be of type {expected_type.__name__}"

    # Delete precondition data
    delete_samples()