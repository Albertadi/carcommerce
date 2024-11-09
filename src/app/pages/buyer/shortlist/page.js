"use client";

import React, { useState } from 'react';
import { Heart, Trash2, Phone, Mail } from 'lucide-react';

const Shortlist = () => {
  const [shortlistedCars, setShortlistedCars] = useState([
    {
      id: 1,
      image: "/api/placeholder/400/300",
      title: "2023 Toyota Camry",
      price: "35,000",
      mileage: "15,000",
      location: "New York, NY",
      agent: {
        name: "John Smith",
        phone: "+1 234-567-8900",
        email: "john.smith@example.com"
      }
    },
    // Add more sample data as needed
  ]);

  const removeFromShortlist = (carId) => {
    setShortlistedCars(cars => cars.filter(car => car.id !== carId));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Shortlist</h2>
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" size={24} />
          <span className="text-gray-600">{shortlistedCars.length} cars</span>
        </div>
      </div>

      {shortlistedCars.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Heart className="text-gray-400" size={48} />
            <h3 className="text-xl font-semibold text-gray-700">Your shortlist is empty</h3>
            <p className="text-gray-500">Start adding cars to your shortlist by clicking the heart icon on listings you like.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shortlistedCars.map((car) => (
            <div 
              key={car.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img 
                  src={car.image} 
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromShortlist(car.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-200"
                >
                  <Trash2 className="text-red-500" size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{car.title}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-red-500">${car.price}</span>
                  <span className="text-sm text-gray-500">{car.mileage} miles</span>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  📍 {car.location}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact Agent</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{car.agent.name}</p>
                    <div className="flex gap-4">
                      <a 
                        href={`tel:${car.agent.phone}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Phone size={16} />
                        <span>Call</span>
                      </a>
                      <a 
                        href={`mailto:${car.agent.email}`}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Mail size={16} />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shortlist;