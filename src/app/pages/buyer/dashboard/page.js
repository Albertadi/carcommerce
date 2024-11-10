"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CarFront, Heart, Star } from "lucide-react";
import Ratings from "../ratings/page";
import Shortlist from "../shortlist/page";
import { AuthContext } from "../../authorization/AuthContext";
import axios from 'axios';

// Simple ListingsView component
function ListingsView() {
  const { access_token } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/listing/search_listing',
          {},
          {
            headers: { Authorization: `Bearer ${access_token}` }
          }
        );
        if (Array.isArray(response.data.listing_list)) {
          setListings(response.data.listing_list);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [access_token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div 
          key={listing.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
          onClick={() => router.push(`/pages/buyer/listing/${listing.id}`)}
        >
          <img
            src={listing.image_url ? `http://localhost:5000/uploads/${listing.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
            alt={`${listing.make} ${listing.model}`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {listing.make} {listing.model} ({listing.year})
            </h3>
            <p className="text-gray-600">${listing.price.toLocaleString()}</p>
            <p className="text-gray-600">{listing.mileage.toLocaleString()} km</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { access_token, permissions } = useContext(AuthContext); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (access_token && permissions) {
      if (!permissions?.sub.has_buy_permission) {
        router.push('/');
      } else {
        setIsLoading(false);
      }
    } else if (!access_token) {
      router.push('/');
    }
  }, [access_token, permissions, router]);

  const [selectedOption, setSelectedOption] = useState("listings");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  if (isLoading) {
    return null;
  }

  const menuItems = [
    {
      id: 'listings',
      label: 'Car Listings',
      icon: CarFront
    },
    {
      id: 'shortlist',
      label: 'My Shortlist',
      icon: Heart
    },
    {
      id: 'ratings',
      label: 'Rate Agents',
      icon: Star
    }
  ];

  return (
    <div className="bg-gray-100 flex text-white h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Column: Dashboard Options */}
      <div className="w-1/4 bg-gradient-to-b from-red-500 to-red-600 p-6 overflow-hidden h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${selectedOption === item.id 
                      ? 'bg-white text-red-500 shadow-md transform scale-105' 
                      : 'text-white hover:bg-red-400'}
                  `}
                  onClick={() => handleOptionClick(item.id)}
                >
                  <Icon size={20} />
                  <span className="text-left">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Column: Content */}
      <div className="w-3/4 p-6 overflow-y-auto h-full bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {selectedOption === "listings" && <ListingsView />}
          {selectedOption === "shortlist" && <Shortlist />}
          {selectedOption === "ratings" && <Ratings />}
        </div>
      </div>
    </div>
  );
}