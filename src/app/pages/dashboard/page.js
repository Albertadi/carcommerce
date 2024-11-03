"use client";

import { useState } from "react";
import ProfilePage from "../userProfiles/page";

export default function Dashboard() {
  // State to track the selected option for content display
  const [selectedOption, setSelectedOption] = useState("option1");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="bg-gray-100 h-[calc(100vh-64px)]"> {/* Adjust height based on header size */}
      {/* Main Section */}
      <div className="flex h-full text-black">
        {/* Left Column: Dashboard Options */}
        <div className="w-1/4 bg-red-500 p-5 h-full overflow-y-auto">
          <ul className="space-y-2 m-0 p-0"> {/* Ensure no margin or padding on <ul> */}
            <li>
              <button
                className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                  selectedOption === "option1" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleOptionClick("option1")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                  selectedOption === "option2" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleOptionClick("option2")}
              >
                User Profile Management
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                  selectedOption === "option3" ? "bg-gray-300" : ""
                }`}
                onClick={() => handleOptionClick("option3")}
              >
                User Account Management
              </button>
            </li>
          </ul>
        </div>

        {/* Right Column: Content Based on Selected Option */}
        <div className="w-3/4 p-4 h-full overflow-y-auto">
          {selectedOption === "option1" && (
            <div>
              <h2 className="text-2xl font-semibold">Content for Option 1</h2>
              <p>This is the content that shows for Option 1.</p>
            </div>
          )}
          {selectedOption === "option2" && (
            <div>
              <ProfilePage />
            </div>
          )}
          {selectedOption === "option3" && (
            <div>
              <h2 className="text-2xl font-semibold">Content for Option 3</h2>
              <p>This is the content that shows for Option 3.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
