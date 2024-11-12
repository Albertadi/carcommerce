"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../pages/authorization/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { access_token, permissions, logout } = useContext(AuthContext);
  const router = useRouter();

  const handleClick = (element) => {
    if (permissions) {
      if (permissions.sub.has_admin_permission) {
        router.push('/pages/admin/dashboard');
      } else if (permissions.sub.has_listing_permission) {
        router.push('/pages/agent/dashboard');
      } else if (permissions.sub.has_sell_permission) {
        router.push('/pages/seller/dashboard');
      } else if (permissions.sub.has_buy_permission) {
        if (element == "logo") {
          router.push('/pages/buyer');
        } else if (element == "account") {
          router.push('/pages/buyer/dashboard');
        }
      } else {
        router.push('/');
      }
    }
    else {
      router.push('/');
    }
  }

  const handleLogin = () => {
    router.push("/pages/login");
  };

  const handleLogout = () => {
    router.push("/");
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="sticky top-0 bg-white h-16 shadow-xl w-full flex items-center z-10">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a onClick={() => handleClick("logo")} className="flex items-center cursor-pointer -ml-20">
            <p className="text-5xl font-rajdhaniBold pl-10">
              <span className="text-[#D6D0D0]">TECH</span>
              <span className="text-[#f75049]">Quest</span>
            </p>
          </a>

          {/* Navbar toggle (for small screens) */}
          <button
            className="block md:hidden text-[#0e0e17] focus:outline-none"
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
                onClick={() => handleClick("account")} 
                className="text-[#0e0e17] hover:text-[#f0b537] font-rajdhaniBold text-lg flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Account
              </button>
            ) : (
              <></>
            )}
            {/* Login/Logout Button */}
            {access_token ? (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-[#0e0e17] hover:text-[#f0b537] font-rajdhaniBold text-lg flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-[#0e0e17] hover:text-[#f0b537] font-rajdhaniBold text-lg flex items-center gap-1"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl text-[#f75049] font-rajdhaniBold mb-4">Confirm Logout</h2>
            <p className="text-lg text-[#0e0e17] font-rajdhaniSemiBold mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-[#f75049] font-rajdhaniSemiBold text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-300  font-rajdhaniSemiBold text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}