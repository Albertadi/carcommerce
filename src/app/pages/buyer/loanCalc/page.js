"use client";

import { useState } from 'react';
import axios from 'axios';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

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
    <div className="p-8"> {/* Added outer padding */}
      <h2 className="text-2xl font-rajdhaniBold text-center mb-6">Loan Calculator</h2>
      
      <div className="flex flex-col space-y-4">
        {/* Principal Amount Input */}
        <div className="flex flex-col space-y-2">
          <label className="font-rajdhaniSemiBold text-gray-600">Principal Amount ($)</label>
          <input
            type="number"
            placeholder="Enter principal amount"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#f75049]/20 focus:border-[#f75049]"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            min="0"
          />
        </div>

        {/* Interest Rate Input */}
        <div className="flex flex-col space-y-2">
          <label className="font-rajdhaniSemiBold text-gray-600">Interest Rate (%)</label>
          <input
            type="number"
            placeholder="Enter interest rate"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#f75049]/20 focus:border-[#f75049]"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {/* Loan Term Input */}
        <div className="flex flex-col space-y-2">
          <label className="font-rajdhaniSemiBold text-gray-600">Loan Term (Years)</label>
          <input
            type="number"
            placeholder="Enter loan term"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#f75049]/20 focus:border-[#f75049]"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="0"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculateLoan}
          className="bg-[#f75049] text-white py-3 rounded font-rajdhaniBold hover:bg-[#f75049]/90 transition duration-200 mt-2"
        >
          Calculate
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mt-2 font-rajdhaniSemiBold">
            {errorMessage}
          </div>
        )}

        {/* Monthly Payment Result */}
        {monthlyPayment !== null && (
          <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-rajdhaniBold text-gray-800">Monthly Payment</h3>
            <p className="text-2xl font-rajdhaniBold text-[#f75049] mt-2">
              ${parseFloat(monthlyPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}