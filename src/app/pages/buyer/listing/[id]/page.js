"use client";

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../authorization/AuthContext';
import axios from 'axios';

const CarDetails = ({ params }) => {
  const { id } = params; // Get the dynamic route parameter
  const { access_token } = useContext(AuthContext);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (!id || !access_token) {
        setError("Missing listing ID or authentication");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/listing/view_listing?id=${id}`,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.listing) {
          setCarData(response.data.listing);
        } else {
          setError("Listing not found");
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError(error.response?.data?.error || "Failed to load listing details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, access_token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f0f7] flex items-center justify-center">
        <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-solid border-gray-300 border-t-[#f75049]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f0f7] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="min-h-screen bg-[#f0f0f7] flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-500 text-xl">No listing data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f0f7] min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Car Images Section */}
        <div className="p-6">
          <img
            src={carData.image_url ? `http://localhost:5000/uploads/${carData.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
            alt={`${carData.make} ${carData.model}`}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Car Details Section */}
        <div className="px-6 py-4 border-t">
          <h2 className="text-3xl font-rajdhaniBold text-[#f75049]">
            {`${carData.make} ${carData.model} (${carData.year})`}
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            {`${carData.mileage.toLocaleString()} km | ${carData.transmission}`}
          </p>
          <p className="text-2xl font-bold text-[#f75049] mt-4">
            ${carData.price.toLocaleString()}
          </p>
        </div>

        {/* Specifications Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-rajdhaniBold text-gray-800 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-medium">Make:</span>
                <span>{carData.make}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Model:</span>
                <span>{carData.model}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Year:</span>
                <span>{carData.year}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">VIN:</span>
                <span>{carData.vin}</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-medium">Mileage:</span>
                <span>{carData.mileage.toLocaleString()} km</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Transmission:</span>
                <span>{carData.transmission}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Fuel Type:</span>
                <span>{carData.fuel_type}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span>{carData.is_sold ? 'Sold' : 'Available'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Seller Contact Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-rajdhaniBold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span className="font-medium">Seller Email:</span>
              <span>{carData.seller_email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Agent Email:</span>
              <span>{carData.agent_email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium">Listed Date:</span>
              <span>{new Date(carData.listing_date).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;