# Libraries
import requests, json

# Local dependencies
from src.controller.app import flask_app

def getAdminToken():
    admin_details = {
        "email": "admin@admin.com",
        "password": "admin"
    }

    with flask_app.app_context():
        login_url = "http://localhost:5000/api/login"
        response = requests.post(login_url, json=admin_details)
        token = json.loads(response.text)["access_token"]

        return token
