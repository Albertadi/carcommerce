"use client";

import { useState } from "react";

export default function Header() {
  {
    /* Navigation */
  }

  /* This function is for minimizing the header in mobile screens (might remove later)*/
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white py-5 shadow-md fixed w-full">
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
            <a href="#" className="nav-link text-gray-600 hover:text-gray-800">
              Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
