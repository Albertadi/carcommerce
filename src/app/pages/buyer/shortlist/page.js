"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Heart, Trash2, Mail, Search } from 'lucide-react';
import { AuthContext } from '../../authorization/AuthContext';
import axios from 'axios';

const ShortlistPage = () => {
  const { access_token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistedCars, setShortlistedCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await axios.get(
          'http://localhost:5000/api/shortlist/view_shortlist',
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        );

        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setShortlistedCars(response.data.data);
        } else {
          setError('Failed to load shortlist');
        }
      } catch (error) {
        console.error('Error fetching shortlist:', error);
        setError(error.response?.data?.error || 'Failed to load shortlist');
      } finally {
        setIsLoading(false);
      }
    };

    if (access_token) {
      fetchShortlist();
    }
  }, [access_token]);

  const removeFromShortlist = async (listingId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/shortlist/remove_from_shortlist/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      if (response.status === 200) {
        setShortlistedCars(prevCars => prevCars.filter(car => car.listing_id !== listingId));
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      alert(error.response?.data?.error || 'Failed to remove from shortlist');
    }
  };

  const filteredCars = shortlistedCars.filter(car => {
    if (!searchQuery) return true;
    
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const carData = car.listing;
    
    return searchTerms.every(term => 
      carData.make?.toLowerCase().includes(term) ||
      carData.model?.toLowerCase().includes(term) ||
      carData.year?.toString().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

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
          placeholder="Search by make, model, or year (e.g., Toyota Camry 2020)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                   focus:ring-2 focus:ring-red-500 focus:border-red-500 
                   text-gray-800 bg-white placeholder-gray-500"
        />
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : filteredCars.length === 0 ? (
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((item) => {
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
                  <button
                    onClick={() => removeFromShortlist(item.listing_id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </button>
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
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                          <Mail size={16} />
                          <span>Contact Agent</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShortlistPage;