"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Heart, Search } from 'lucide-react';
import { AuthContext } from '../../authorization/AuthContext';
import axios from 'axios';

const ShortlistPage = () => {
  const { access_token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistedCars, setShortlistedCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invalidMessage, setInvalidMessage] = useState('');

  const fetchShortlist = async (search = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const endpoint = search
        ? `http://localhost:5000/api/shortlist/search_shortlist?search=${encodeURIComponent(search)}`
        : 'http://localhost:5000/api/shortlist/view_shortlist';

      const response = await axios.get(
        endpoint,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setShortlistedCars(response.data.data);
      } else {
        setInvalidMessage(response.data?.error || 'Failed to load shortlist');
        setTimeout(() => {
          setInvalidMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error fetching shortlist:', error);
      setInvalidMessage(error.response?.data?.error || 'Failed to load shortlist');
      setTimeout(() => {
        setInvalidMessage('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (access_token) {
      fetchShortlist();
    }
  }, [access_token]);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (access_token) {
        fetchShortlist(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, access_token]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      );
    }

    if (shortlistedCars.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {searchQuery ? (
              <>
                <Search className="text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-700">No matching cars found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <Heart className="text-gray-400" size={48} />
                <h3 className="text-xl font-semibold text-gray-700">Your shortlist is empty</h3>
                <p className="text-gray-500">Start adding cars to your shortlist by clicking the heart icon on listings you like.</p>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shortlistedCars.map((item) => {
          const car = item.listing;
          return (
            <div 
              key={item.listing_id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={car.image_url ? `http://localhost:5000/uploads/${car.image_url}` : '/api/placeholder/400/300'}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="p-4 text-gray-800">
                <h3 className="text-lg font-semibold mb-2">
                  {car.make} {car.model} ({car.year})
                </h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-red-500">
                    ${car.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {car.mileage?.toLocaleString()} km
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Car Details</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>Fuel Type: {car.fuel_type}</p>
                      <p>Transmission: {car.transmission}</p>
                      <p>VIN: {car.vin}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Contact Details</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600">Seller: {car.seller_email}</p>
                      <p className="text-gray-600">Agent: {car.agent_email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Shortlist</h1>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by make"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-red-500 focus:border-red-500 
                   text-gray-800 bg-white placeholder-gray-500"
        />
      </div>

      {invalidMessage && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          {invalidMessage}
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default ShortlistPage;