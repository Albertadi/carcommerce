# Libraries
from flask import Blueprint, request, jsonify

# Blueprint for the loan calculator
loan_calculator_blueprint = Blueprint('loan_calculator', __name__)

class LoanCalculatorController:
    @loan_calculator_blueprint.route('/api/loan_calculator', methods=['POST'])
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

            """
            Calculate the monthly payment using the formula:
            M = P[r(1 + r)^n] / [(1 + r)^n – 1]
            where:
            - M is the total monthly payment
            - P is the principal loan amount
            - r is the monthly interest rate
            - n is the number of payments (months)
            """

            monthly_interest_rate = interest_rate / 100 / 12
            number_of_payments = years * 12

            if monthly_interest_rate == 0:  # No interest scenario
                return principal / number_of_payments

            monthly_payment = (principal * monthly_interest_rate * (1 + monthly_interest_rate) ** number_of_payments) / ((1 + monthly_interest_rate) ** number_of_payments - 1)

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
