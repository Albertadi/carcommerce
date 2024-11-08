"use client"; // Mark as Client Component

import { useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { AuthContext } from '../authorization/AuthContext'; // Corrected import path
=======
import { AuthContext } from '../../authorization/AuthContext';
>>>>>>> 68616ea (edit buyer page(havent worked))
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axios from 'axios'; // Import Axios for API requests

export default function BuyerPage() {
  const { user, token } = useContext(AuthContext); // Access user and token from context
<<<<<<< HEAD
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [carListings, setCarListings] = useState([]); // State for car listings
  const [filteredCarListings, setFilteredCarListings] = useState([]); // State for filtered car listings
  const [selectedFilters, setSelectedFilters] = useState({}); // State for selected filters (price, mileage, etc.)
  const [dropdownVisibility, setDropdownVisibility] = useState({}); // State to track visibility of each dropdown
=======
  const [filterOptions, setFilterOptions] = useState({});
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [carListings, setCarListings] = useState([]); // State for car listings
  const [filteredCarListings, setFilteredCarListings] = useState([]); // State for filtered listings
>>>>>>> 68616ea (edit buyer page(havent worked))
  const router = useRouter(); // Initialize router

  useEffect(() => {
    // Fetch car listings from your backend (adjust URL and request logic as needed)
    const fetchCarListings = async () => {
      try {
        const response = await axios.get('/api/cars'); // Replace with your API endpoint
        setCarListings(response.data); // Assuming the API returns an array of car listings
<<<<<<< HEAD
        setFilteredCarListings(response.data); // Set filtered listings to be the same as the full list initially
=======
        setFilteredCarListings(response.data); // Initially show all car listings
>>>>>>> 68616ea (edit buyer page(havent worked))
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    filterCarListings(e.target.value, selectedFilters); // Call filtering on input change
  };

  // Handle dropdown option change (filtering)
  const handleFilterChange = (filterCategory, value) => {
    const updatedFilters = { ...selectedFilters, [filterCategory]: value };
    setSelectedFilters(updatedFilters); // Update selected filters
    filterCarListings(searchInput, updatedFilters); // Apply the filter based on selected filters and search input
    toggleDropdownVisibility(filterCategory); // Close the dropdown after selection
  };

  // Toggle visibility of dropdown
  const toggleDropdownVisibility = (filterCategory) => {
    setDropdownVisibility((prevVisibility) => ({
      ...prevVisibility,
      [filterCategory]: !prevVisibility[filterCategory], // Toggle visibility of the dropdown
    }));
  };

  // Function to filter car listings based on search input and selected filters
  const filterCarListings = (searchKeyword, filters) => {
    let filtered = carListings;

    // Filter by search keyword (car model matching)
    if (searchKeyword) {
      filtered = filtered.filter(car => car.model.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    // Filter by selected filters (price, mileage, etc.)
    Object.keys(filters).forEach((filterCategory) => {
      const filterValue = filters[filterCategory];
      if (filterValue) {
        filtered = filtered.filter(car => {
          if (filterCategory === "Price") {
            // Handle price range filtering
            if (filterValue === "Under $10,000" && car.price < 10000) return true;
            if (filterValue === "$10,000 - $20,000" && car.price >= 10000 && car.price <= 20000) return true;
            if (filterValue === "$20,000 - $30,000" && car.price >= 20000 && car.price <= 30000) return true;
            if (filterValue === "Over $30,000" && car.price > 30000) return true;
          }
          if (filterCategory === "Mileage") {
            // Handle mileage range filtering
            if (filterValue === "Under 20,000 km" && car.mileage < 20000) return true;
            if (filterValue === "20,000 - 50,000 km" && car.mileage >= 20000 && car.mileage <= 50000) return true;
            if (filterValue === "50,000 - 100,000 km" && car.mileage >= 50000 && car.mileage <= 100000) return true;
            if (filterValue === "Over 100,000 km" && car.mileage > 100000) return true;
          }
          if (filterCategory === "Year") {
            // Handle year filtering
            if (filterValue === car.year) return true;
          }
          if (filterCategory === "Availability") {
            // Handle availability filtering
            if (filterValue === car.availability) return true;
          }
          return false;
        });
      }
    });

    setFilteredCarListings(filtered); // Update filtered car listings
  };

  // Handle car image or view details click
  const handleCarClick = (id) => {
    if (!token) {
      // Redirect to login page if not authenticated
      window.location.href = '/pages/login';
    } else {
      // Navigate to car details page (assuming you have a route for this)
      router.push(`/pages/car/${id}`); // Adjust the path as needed
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
        />
        <div className="flex space-x-2">
          {Object.keys(filterData).map((filter) => (
            <div key={filter} className="relative group">
              <button 
                className="bg-gray-200 px-3 py-1 rounded" 
                onClick={() => toggleDropdownVisibility(filter)} // Toggle dropdown visibility
              >
                {filter}
              </button>
              {dropdownVisibility[filter] && ( // Show dropdown only if visible
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  {filterData[filter].map((option) => (
                    <div 
                      key={option} 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFilterChange(filter, option)} // Apply filter on click
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
                  src={car.imageUrl} 
                  alt={car.model} 
                  className="w-full h-48 object-cover rounded"
                />
                <h2 className="text-xl font-bold mt-2">{car.model} ({car.year})</h2>
                <p className="text-gray-600">Price: ${car.price}</p>
                <p className="text-gray-600">Mileage: {car.mileage} km</p>
                <Link 
                  href={`/car/${car.id}`} 
                  onClick={() => handleCarClick(car.id)} 
                  className="text-blue-500 underline">View Details</Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
