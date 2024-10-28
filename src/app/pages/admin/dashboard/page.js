"use client";

import { useState } from "react";
import ProfilePage from "../userProfiles/page";
import CrudsAccount from "../crudsaccount/page";

export default function Dashboard() {
  {
    /* This function is for switching the html elements of the right column of the page (depending on the option selected*/
  }
  const [selectedOption, setSelectedOption] = useState("option1");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <body className="bg-gray-100">
      <div className="flex pt-20 text-black">
        {/* Left Column: Dashboard Options */}
        <div className="w-1/2 bg-red-500 p-5 h-screen">
          <ul className="space-y-2">
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
        <div className="w-3/4 p-4">
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
              <CrudsAccount />
            </div>
          )}
        </div>
      </div>
      
      {/* Link to page
      <a
        href="https://front.codes/"
        className="logo fixed bottom-0 right-0 p-4"
        target="_blank"
      >
        <img
          src="https://assets.codepen.io/1462889/fcy.png"
          alt="Logo"
          className="w-16 h-16"
        />
      </a> */}
    </body>
  );
}
