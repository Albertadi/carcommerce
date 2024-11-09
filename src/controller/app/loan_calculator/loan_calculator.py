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

            # Calculate monthly payment
            monthly_interest_rate = interest_rate / 100 / 12
            number_of_payments = years * 12

            if monthly_interest_rate == 0:  # No interest scenario
                monthly_payment = principal / number_of_payments
            else:
                monthly_payment = (principal * monthly_interest_rate * (1 + monthly_interest_rate) ** number_of_payments) / ((1 + monthly_interest_rate) ** number_of_payments - 1)

            # Calculate total payment
            total_payment = monthly_payment * number_of_payments

            # Prepare and return response
            response = {
                "monthly_payment": round(monthly_payment, 2),
                "total_payment": round(total_payment, 2)
            }
            return jsonify(response), 200

        except ValueError:
            return jsonify({"error": "Invalid input types. Ensure principal and interest_rate are numbers and years is an integer."}), 400
