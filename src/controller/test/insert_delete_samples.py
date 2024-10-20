# Libraries
import json
import datetime

# Local dependencies
from src.controller.app import flask_app
from src.entity import db, User, Profile #, Suspension

def insert_samples():
    with flask_app.app_context():
        