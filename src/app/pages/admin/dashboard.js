"use client";

import { useState } from "react";
import dashboard from "./dashboard";

export default function Dashboard() {
  {
    /* This function is for minimizing the header in mobile screens (might remove later)*/
  }
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  {
    /* This function is for switching the html elements of the right column of the page (depending on the option selected*/
  }
  const [selectedOption, setSelectedOption] = useState("option1");
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <body className="bg-gray-100">
      {/* Navigation */}
      <div className="bg-white py-5 shadow-md fixed w-full z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Brand Logo */}
            <a
              href=""
              target="_blank"
              className="text-gray-600 text-5xl text-red-500 font-bold"
            >
              TQ
            </a>

            {/* Navbar toggle (for small screens) */}
            <button
              className="block md:hidden text-gray-600 focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>

            {/* Navbar links */}
            <div
              className={`md:flex md:items-center space-x-8 ${
                isMenuOpen ? "block" : "hidden"
              }`}
            >
              <a
                href="#"
                className="nav-link text-gray-600 hover:text-gray-800"
              >
                Account
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}

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
              <h2 className="text-2xl font-semibold">Content for Option 2</h2>
              <p>This is the content that shows for Option 2.</p>
              <dashboard/>
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

      {/* Switch Section */}
      <div className=""></div>

      {/* Footer Section */}
      <div className=""></div>

      {/* Link to page */}
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
      </a>
    </body>
  );
}
