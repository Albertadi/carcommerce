class LoanCalculator:
    def __init__(self, principal: float, interest_rate: float, years: int):
        self.principal = principal
        self.interest_rate = interest_rate
        self.years = years

    def calculate_monthly_payment(self) -> float:
        """
        Calculate the monthly payment using the formula:
        M = P[r(1 + r)^n] / [(1 + r)^n – 1]
        where:
        - M is the total monthly payment
        - P is the principal loan amount
        - r is the monthly interest rate
        - n is the number of payments (months)
        """
        monthly_interest_rate = self.interest_rate / 100 / 12
        number_of_payments = self.years * 12

        if monthly_interest_rate == 0:  # No interest scenario
            return self.principal / number_of_payments

        monthly_payment = (self.principal * monthly_interest_rate * (1 + monthly_interest_rate) ** number_of_payments) / ((1 + monthly_interest_rate) ** number_of_payments - 1)
        return monthly_payment
