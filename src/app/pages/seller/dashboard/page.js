"use client";

import { useState } from "react";
import ListingPage from '../listings/page';
import SellerProfilePage from '../sellerProfile/page'
import RatingsPage from '../ratings/page'

export default function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-[#e2e2ef] flex text-white h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Column: Dashboard Options */}
      <div className="w-1/4 bg-[#f75049] p-5 overflow-hidden h-full">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option1" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option1")}
            >
              Seller Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option2" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option2")}
            >
              Rate Agents
            </button>
          </li>
          <li>
            <button
              className={`w-full font-rajdhaniSemiBold text-xl text-left p-2 hover:bg-[#5ef6ff] ${
                selectedOption === "option3" ? "bg-[#5ef6ff]/60 border-2 border-[#5ef6ff]" : ""
              }`}
              onClick={() => handleOptionClick("option3")}
            >
              My Listings
            </button>
          </li>
        </ul>
      </div>

      {/* Right Column: Content Based on Selected Option */}
      <div className="w-3/4 p-4 overflow-y-auto h-full">
        {selectedOption === "option1" && (
          <div>
            <SellerProfilePage
              email="seller@example.com"
              firstName="John"
              lastName="Doe"
              dob="dob"
            />
          </div>
        )}
        {selectedOption === "option2" && (
          <div>
            <RatingsPage />
          </div>
        )}
        {selectedOption === "option3" && (
          <div>
            <ListingPage />
          </div>
        )}
      </div>
    </div>
  );
}