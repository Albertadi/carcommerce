"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../pages/authorization/AuthContext"; // Ensure this path is correct
import { useRouter } from "next/navigation";

export default function Header() {
  // State for controlling mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Access the AuthContext and router
  const { token, user, logout } = useContext(AuthContext);
  const router = useRouter();

  // Handle login redirection
  const handleLogin = () => {
    router.push("/pages/login");
  };

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Render the header
  return (
    <div className="sticky top-0 bg-white h-16 shadow-xl w-full flex items-center z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a
            href="/"
            className="text-5xl text-red-500 font-bold"
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
            {/* Account link */}
            <a href="#" className="nav-link hover:text-red-500">
              Account
            </a>

            {/* Login/Logout Button */}
            {token ? (
              <button
                onClick={handleLogout} // Use the logout function from AuthContext
                className="text-red-500 font-semibold hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin} // Redirect to login page
                className="text-red-500 font-semibold hover:text-red-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
