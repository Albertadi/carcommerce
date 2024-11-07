"use client"; // Mark as Client Component

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axios from 'axios'; // Import Axios for API requests

export default function BuyerPage() {
  const { user, token } = useContext(AuthContext); // Access user and token from context
  const [filterOptions, setFilterOptions] = useState({});
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [carListings, setCarListings] = useState([]); // State for car listings
  const [filteredCarListings, setFilteredCarListings] = useState([]); // State for filtered listings
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Fetch car listings from your backend (adjust URL and request logic as needed)
    const fetchCarListings = async () => {
      try {
        const response = await axios.get('/api/cars'); // Replace with your API endpoint
        setCarListings(response.data); // Assuming the API returns an array of car listings
        setFilteredCarListings(response.data); // Initially show all car listings
      } catch (error) {
        console.error("Error fetching car listings:", error);
      }
    };

    fetchCarListings();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Dropdown options
  const filterData = {
    Mileage: ["Under 20,000 km", "20,000 - 50,000 km", "50,000 - 100,000 km", "Over 100,000 km"],
    "Brand & Model": ["Toyota", "Honda", "Ford", "BMW", "Mercedes"],
    Price: ["Under $10,000", "$10,000 - $20,000", "$20,000 - $30,000", "Over $30,000"],
    Year: ["2024", "2023", "2022", "2021", "2020", "Older"],
    Availability: ["Available", "Sold Out"],
  };

  const handleMouseEnter = (filter) => {
    setFilterOptions((prev) => ({ ...prev, [filter]: true }));
  };

  const handleMouseLeave = (filter) => {
    setFilterOptions((prev) => ({ ...prev, [filter]: false }));
  };

  // Handle dropdown option click
  const handleDropdownClick = (option) => {
    if (!token) {
      // Redirect to login page if not authenticated
      router.push('/login');
    } else {
      router.push('/buyer'); // Navigate to the buyer page
    }
  };

  // Handle car image or view details click
  const handleCarClick = (id) => {
    if (!token) {
      // Redirect to login page if not authenticated
      router.push('/login');
    } else {
      // Navigate to car details page (assuming you have a route for this)
      router.push(`/car/${id}`); // Adjust the path as needed
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Filter car listings based on search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!token) {
        router.push('/login'); // Redirect to login page if not authenticated
      } else {
        const filtered = carListings.filter(car => 
          car.model.toLowerCase().includes(searchInput.toLowerCase()) ||
          car.year.toString().includes(searchInput) ||
          car.price.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredCarListings(filtered); // Update the filtered car listings
      }
    }
  };

  return (
    <div className="bg-[#f0f0f7] font-rajdhaniSemiBold min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center p-8 bg-orange-100">
        <h1 className="text-4xl font-rajdhaniBold text-[#f75049]">WELCOME TO THE BUYER PAGE</h1>
        <p className="mt-2 text-lg text-[#f75049]">Drive an EV for Free! Sell us your car and drive home any of our electric vehicles for a 7-day test drive!</p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col items-center mt-8 px-4">
        <input
          type="text"
          placeholder="What car are you searching for?"
          className="w-full max-w-lg p-2 mb-4 border border-gray-300 rounded text-black"
          value={searchInput} // Set the value of the input
          onChange={handleSearchChange} // Handle input change
          onKeyPress={handleKeyPress} // Handle key press event
        />
        <div className="flex space-x-2">
          {Object.keys(filterData).map((filter) => (
            <div 
              key={filter} 
              className="relative group"
              onMouseEnter={() => handleMouseEnter(filter)}
              onMouseLeave={() => handleMouseLeave(filter)}
            >
              <button className="bg-gray-200 px-3 py-1 rounded">{filter}</button>
              {filterOptions[filter] && (
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  {filterData[filter].map((option) => (
                    <div 
                      key={option} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDropdownClick(option)} // Call handleDropdownClick on click
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Car Listings Section */}
      <div className="overflow-y-auto h-[600px]"> {/* Fixed height and scrolling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCarListings.length === 0 ? (
            <p className="text-center text-xl">No car listings available.</p>
          ) : (
            filteredCarListings.map(car => (
              <div key={car.id} className="bg-white p-4 rounded shadow">
                <img 
                  src={car.image} 
                  alt={car.model} 
                  className="w-full h-48 object-cover rounded cursor-pointer" 
                  onClick={() => handleCarClick(car.id)} // Handle car image click
                />
                <h2 className="text-xl font-bold mt-2">{car.model} ({car.year})</h2>
                <p className="text-lg text-[#f75049]">{car.price}</p>
                <Link 
                  href="#" // Keep this link disabled or adjust based on your routing
                  className="text-blue-500 hover:underline" 
                  onClick={() => handleCarClick(car.id)} // View details on click
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
