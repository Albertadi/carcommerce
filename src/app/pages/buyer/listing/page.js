// pages/car/[id].js

import React from 'react';

const CarDetails = () => {
  return (
    <div className="bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Car Images Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src="/car-main.jpg" // Replace with main car image URL
              alt="Main car view"
              className="w-full h-72 object-cover rounded-lg"
            />
            <div className="grid grid-cols-2 gap-2">
              <img src="/car-side.jpg" alt="Side view" className="h-36 object-cover rounded-lg" />
              <img src="/car-interior.jpg" alt="Interior view" className="h-36 object-cover rounded-lg" />
              <img src="/car-back.jpg" alt="Back view" className="h-36 object-cover rounded-lg" />
              <img src="/car-engine.jpg" alt="Engine view" className="h-36 object-cover rounded-lg" />
            </div>
          </div>
        </div>

        {/* Car Details Section */}
        <div className="px-6 py-4 border-t">
          <h2 className="text-3xl font-semibold text-gray-800">Nissan Skyline GTR 1999</h2>
          <p className="text-lg text-gray-600 mt-2">2023 | 20,000 km | Manual</p>
          <p className="text-xl font-bold text-gray-900 mt-4">$187,000</p>
        </div>

        {/* Specifications Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-semibold text-gray-800">Specifications</h3>
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
            <div>
              <p><strong>Make:</strong> Nissan</p>
              <p><strong>Model:</strong> Skyline</p>
              <p><strong>Variant:</strong> GTR</p>
              <p><strong>Year:</strong> 1999</p>
            </div>
            <div>
              <p><strong>Mileage:</strong> 20,000 km</p>
              <p><strong>Transmission:</strong> Manual</p>
              <p><strong>Fuel Type:</strong> Petrol</p>
              <p><strong>Engine Capacity:</strong> 2.0L</p>
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
