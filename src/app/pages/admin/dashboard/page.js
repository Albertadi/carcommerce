"use client";

import { useState, useContext } from "react";
import ProfilePage from "../userProfiles/page";
import CrudsAccount from "../crudsaccount/page";
import AdminProfile from "../adminProfile/page";
import { AuthContext } from "../../authorization/AuthContext"; // Adjust path as needed

export default function Dashboard() {
  {
    /* This function is for switching the html elements of the right column of the page (depending on the option selected*/
  }
  const { authToken, user } = useContext(AuthContext); // Access the token and user data
  const [selectedOption, setSelectedOption] = useState("option1");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-gray-100 flex text-white">
      {/* Left Column: Dashboard Options */}
      <div className="w-1/2 bg-red-500 p-5 overflow-hidden">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-red-200 ${
                selectedOption === "option1" ? "bg-red-300" : ""
              }`}
              onClick={() => handleOptionClick("option1")}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-red-200 ${
                selectedOption === "option2" ? "bg-red-300" : ""
              }`}
              onClick={() => handleOptionClick("option2")}
            >
              User Profile Management
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-red-200 ${
                selectedOption === "option3" ? "bg-red-300" : ""
              }`}
              onClick={() => handleOptionClick("option3")}
            >
              User Account Management
            </button>
          </li>
        </ul>
      </div>

      {/* Right Column: Content Based on Selected Option */}
      <div className="w-3/4 p-4 overflow-y-auto h-screen">
        {selectedOption === "option1" && (
          <div>
            <AdminProfile />
          </div>
        )}
        {selectedOption === "option2" && (
          <div>
            <ProfilePage />
          </div>
        )}
        {selectedOption === "option3" && (
          <div>
            <CrudsAccount />
          </div>
        )}
      </div>
    </div>
  );
}
