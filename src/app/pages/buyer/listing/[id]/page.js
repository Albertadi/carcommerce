"use client";

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../authorization/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import BuyerPage from '../../loanCalc/page';
import axios from 'axios';

const CarDetails = ({ params }) => {
  const { id } = params; // Get the dynamic route parameter
  const { access_token } = useContext(AuthContext);
  const router = useRouter();
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoanCalc, setShowLoanCalc] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show loan calculator when user has scrolled 70% of the content
      if (scrollPosition > (documentHeight - windowHeight) * 0.7) {
        setShowLoanCalc(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!carData) {
    return (
      <div className="min-h-screen bg-[#f0f0f7] flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
          <p className="text-gray-500 text-xl">No listing data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f0f7] min-h-screen py-10 px-6 relative">
      {/* Main Listing Card */}
      <div className="max-w-5xl mx-auto bg-white rounded shadow-lg overflow-hidden">

      <div className="px-6 pt-6 pb-0">
          <button
            type="button"
            onClick={() => router.push('/pages/buyer')}
            className="px-6 py-2 bg-[#2570d4] font-rajdhaniSemiBold text-white rounded hover:bg-[#f0b537] transition-colors"
          >
            Back
          </button>
        </div>

        {/* Car Images Section */}
        <div className="p-6">
          <div className="bg-gray-200 rounded h-[500px] flex justify-center"> {/* Added fixed height */}
            <img
              src={carData.image_url ? `http://localhost:5000/uploads/${carData.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
              alt={`${carData.make} ${carData.model}`}
              className="h-full w-auto object-contain rounded px-4" // Using h-full while keeping object-contain
              style={{ objectFit: 'contain', objectPosition: 'center center' }} // Explicit positioning
            />
          </div>
        </div>

        {/* Car Details Section */}
        <div className="px-6 py-4 border-t">
          <h2 className="text-3xl font-rajdhaniBold text-[#f75049]">
            {`${carData.year} ${carData.make} ${carData.model}`}
          </h2>
          <p className="text-lg text-gray-600 mt-2 font-rajdhaniSemiBold">
            {`${carData.mileage.toLocaleString()} km | ${carData.transmission}`}
          </p>
          <p className="text-2xl font-rajdhaniBold text-[#f75049] mt-2">
            ${carData.price.toLocaleString()}
          </p>
        </div>

        {/* Specifications Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-rajdhaniBold text-gray-800 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Make:</span>
                <span className="font-rajdhaniSemiBold">{carData.make}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Model:</span>
                <span className="font-rajdhaniSemiBold">{carData.model}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Year:</span>
                <span className="font-rajdhaniSemiBold">{carData.year}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">VIN:</span>
                <span className="font-rajdhaniSemiBold">{carData.vin}</span>
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Mileage:</span>
                <span className="font-rajdhaniSemiBold">{carData.mileage.toLocaleString()} km</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Transmission:</span>
                <span className="font-rajdhaniSemiBold">{carData.transmission}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Fuel Type:</span>
                <span className="font-rajdhaniSemiBold">{carData.fuel_type}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-rajdhaniBold">Status:</span>
                <span className="font-rajdhaniSemiBold">{carData.is_sold ? 'Sold' : 'Available'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Seller Contact Section */}
        <div className="px-6 py-4 border-t">
          <h3 className="text-2xl font-rajdhaniBold text-gray-800 mb-4">Contact Information</h3>
          <div className="space-y-3">
            <p className="flex justify-between">
              <span className="font-rajdhaniBold">Seller Email:</span>
              <span className="font-rajdhaniSemiBold">{carData.seller_email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-rajdhaniBold">Agent Email:</span>
              <span className="font-rajdhaniSemiBold">{carData.agent_email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-rajdhaniBold">Listed Date:</span>
              <span className="font-rajdhaniSemiBold">{new Date(carData.listing_date).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Separate Loan Calculator Box */}
      <div 
        className={`max-w-5xl mx-auto mt-8 transition-all duration-700 ease-in-out transform 
          ${showLoanCalc 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-20'
          }`}
      >
        <div className="bg-white rounded shadow-lg">
          <BuyerPage />
        </div>
      </div>
    </div>
  );
};

export default CarDetails;