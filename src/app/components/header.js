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
  const { access_token, permissions, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleAccount = () => {
    if (permissions) {
      if (permissions.sub.has_admin_permission) {
        router.push('/pages/admin/dashboard');
      } else if (permissions.sub.has_listing_permission) {
        router.push('/pages/agent/dashboard');
      } else if (permissions.sub.has_sell_permission) {
        router.push('/pages/seller/dashboard');
      } else if (permissions.sub.has_buy_permission) {
        router.push('/pages/buyer/dashboard');
      } else {
        setError('Invalid permissions. Please contact IT administrator.');
      }
    }
  }

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
            className="text-5xl text-[#e2e2ef] font-rajdhaniBold"
          >
            <p>
							TECH<span className="text-[#f75049]">Quest</span>
						</p>
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
            {access_token ? (
              <button
              onClick={handleAccount} // Redirect to login page
              className="text-[#f75049] font-semibold hover:text-red-700 font-rajdhaniBold text-lg"
            >
              Account
            </button>
            ) : (
              <></>
            )}
            
            {/* Login/Logout Button */}
            {access_token ? (
              <button
                onClick={handleLogout} // Use the logout function from AuthContext
                className="text-[#f75049] font-semibold hover:text-red-700 font-rajdhaniBold text-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin} // Redirect to login page
                className="text-[#f75049] font-semibold hover:text-red-700 font-rajdhaniBold text-lg"
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
