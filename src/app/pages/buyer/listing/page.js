// src/app/pages/buyer/listing/page.js
// v1.1

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; // For accessing query parameters

const CarDetails = () => {
  const id = "fa7515b0-a1db-45d6-b913-d610873483a8"; // Get listing ID from URL query
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch the car listing from the API
      fetch(`/api/listing/view_listing?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization token if needed
          // 'Authorization': `Bearer ${token}`
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch listing');
        }
        return response.json();
      })
      .then(data => {
        setCarData(data);
      })
      .catch(error => {
        console.error(error);
        setError("Could not load listing details.");
      });
    }
  }, [id]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!carData) {
    return <div className="text-gray-500 text-center mt-4">Loading...</div>;
  }

  return (
    <div className="bg-[#e2e2ef] py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded shadow-lg">
        {/* Car Images Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={carData.imageUrl || "/default-car-image.jpg"} // Use car image URL or a default
              alt="Car Image"
              className="w-full h-72 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Car Details Section */}
        <div className="px-6 py-4 border-t">
          <h2 className="text-3xl font-semibold text-gray-800">{`${carData.make} ${carData.model} ${carData.variant} ${carData.year}`}</h2>
          <p className="text-lg text-gray-600 mt-2">{`${carData.year} | ${carData.mileage} km | ${carData.transmission}`}</p>
          <p className="text-xl font-bold text-gray-900 mt-4">${carData.price}</p>
        </div>

        {/* Specifications Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-semibold text-gray-800">Specifications</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <div>
              <p><strong>Make:</strong> {carData.make}</p>
              <p><strong>Model:</strong> {carData.model}</p>
              <p><strong>Variant:</strong> {carData.variant}</p>
              <p><strong>Year:</strong> {carData.year}</p>
            </div>
            <div>
              <p><strong>Mileage:</strong> {carData.mileage} km</p>
              <p><strong>Transmission:</strong> {carData.transmission}</p>
              <p><strong>Fuel Type:</strong> {carData.fuelType}</p>
              <p><strong>Engine Capacity:</strong> {carData.engineCapacity}L</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-semibold text-gray-800">Contact Seller</h3>
          <p className="text-gray-700 mt-2">For more information, reach out to the seller or agent through the contact details provided on their profile.</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Contact Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
