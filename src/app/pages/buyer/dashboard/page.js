"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, CarFront, Star, Menu } from "lucide-react";
import Listings from "../listing/page";
import Shortlist from "../shortlist/page"; 
import Ratings from "../ratings/page";
import { AuthContext } from "../../authorization/AuthContext";

const Dashboard = () => {
  const { access_token, permissions } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    { id: 'listings', label: 'Car Listings', icon: CarFront },
    { id: 'shortlist', label: 'My Shortlist', icon: Heart },
    { id: 'ratings', label: 'Rate Agents', icon: Star },
  ];

  return (
    <div className="bg-gray-100 flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Toggle Button - Mobile Only */}
      <button 
        className="fixed top-4 left-4 p-2 bg-red-500 rounded-full text-white md:hidden z-50"
        onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
      >
        <Menu size={24} />
      </button>

      {/* Left Column: Dashboard Options */}
      <div className={`
        ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        fixed md:static md:translate-x-0
        w-64 bg-gradient-to-b from-red-500 to-red-600 
        p-6 h-full shadow-xl z-40
      `}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
        
        <nav>
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
                        ? 'bg-white text-red-500 shadow-lg transform scale-105' 
                        : 'text-white hover:bg-red-400'}
                    `}
                    onClick={() => handleOptionClick(item.id)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {selectedOption === "listings" && <Listings />}
          {selectedOption === "shortlist" && <Shortlist />}
          {selectedOption === "ratings" && <Ratings />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;