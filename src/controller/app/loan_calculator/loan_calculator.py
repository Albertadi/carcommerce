# Libraries
from flask import Blueprint, request, jsonify
from src.entity.loancalc import LoanCalculator  # Importing the LoanCalculator entity

# Blueprint for the loan calculator
loan_calculator_blueprint = Blueprint('loan_calculator', __name__)

class LoanCalculatorController:
    @loan_calculator_blueprint.route('/api/loan/estimate', methods=['POST'])
    def calculate_loan():
        # Parse JSON data from the request
        data = request.get_json()

        # Extract required fields
        principal = data.get('principal')
        interest_rate = data.get('interest_rate')
        years = data.get('years')

        # Input validation
        if not principal or not interest_rate or not years:
            return jsonify({"error": "Missing required parameters: principal, interest_rate, or years"}), 400

        try:
            # Convert inputs to appropriate types
            principal = float(principal)
            interest_rate = float(interest_rate)
            years = int(years)

            # Initialize LoanCalculator and calculate monthly payment
            loan_calculator = LoanCalculator(principal, interest_rate, years)
            monthly_payment = loan_calculator.calculate_monthly_payment()

            # Prepare and return response
            response = {
                "principal": principal,
                "interest_rate": interest_rate,
                "years": years,
                "monthly_payment": round(monthly_payment, 2)
            }
            return jsonify(response), 200

        except ValueError:
            return jsonify({"error": "Invalid input types. Ensure principal and interest_rate are numbers and years is an integer."}), 400
