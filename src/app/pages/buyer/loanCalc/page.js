"use client"; // Mark as Client Component

import { useState } from 'react';
import axios from 'axios';

export default function BuyerPage() {
  // Loan calculator states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Loan calculator function
  const handleCalculateLoan = async () => {
    if (!principal || !interestRate || !years) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/loan_calculator', {
        principal: parseFloat(principal),
        interest_rate: parseFloat(interestRate),
        years: parseInt(years),
      });
      setMonthlyPayment(response.data.monthly_payment);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      {/* Calculator Button */}
      <button
        className="bg-[#f75049] text-white py-2 px-4 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Open Calculator
      </button>

      {/* Loan Calculator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
            <h2 className="text-2xl font-bold text-center mb-4">Loan Calculator</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>

            {/* Loan Calculator Form */}
            <div className="flex flex-col space-y-4">
              <input
                type="number"
                placeholder="Principal Amount"
                className="border p-2 rounded w-full"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                min="0"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                className="border p-2 rounded w-full"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                min="0"
                step="0.01"
              />
              <input
                type="number"
                placeholder="Loan Term (Years)"
                className="border p-2 rounded w-full"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="0"
              />
              <button
                onClick={handleCalculateLoan}
                className="bg-[#f75049] text-white py-2 rounded"
              >
                Calculate
              </button>

              {/* Display error message if any */}
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}

              {/* Display monthly payment if calculated */}
              {monthlyPayment !== null && (
                <div className="text-center mt-4">
                  <p className="text-lg font-semibold">Monthly Payment: ${monthlyPayment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
