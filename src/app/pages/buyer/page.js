"use client"; // Mark as Client Component

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authorization/AuthContext'; // Corrected import path
import Link from 'next/link';
import { useRouter } from "next/navigation";
import axios from 'axios'; // Import Axios for API requests

export default function BuyerPage() {
  const { access_token } = useContext(AuthContext); // Access token from context
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const [carListings, setCarListings] = useState([]); // State for car listings
  const [filteredCarListings, setFilteredCarListings] = useState([]); // State for filtered car listings
  const [selectedFilters, setSelectedFilters] = useState({}); // State for selected filters (price, mileage, etc.)
  const [dropdownVisibility, setDropdownVisibility] = useState({}); // State to track visibility of each dropdown
  const [errorMessage, setErrorMessage] = useState(''); // State to store error message for invalid response
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const router = useRouter(); // Initialize router

  // Dynamic year filter options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Build search filters (based on selected filters)
  const buildSearchFilters = () => {
    const filters = {};
    if (searchInput) filters.search = searchInput;
    if (selectedFilters.Price) filters.price = selectedFilters.Price;
    if (selectedFilters.Mileage) filters.mileage = selectedFilters.Mileage;
    if (selectedFilters.year) filters.year = selectedFilters.year;
    if (selectedFilters.Availability) filters.availability = selectedFilters.Availability;
    return filters;
  };

  // Fetch listings from API
  const fetchListings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const filters = buildSearchFilters(); // Get current filters
    console.log('Sending filters to API:', filters); // Log for debugging

    try {
      const response = await axios.post(
        'http://localhost:5000/api/listing/search_listing',
        filters, // Send filters to API
        {
          headers: { Authorization: `Bearer ${access_token}` }, // Authorization header
        }
      );

      // Check if response contains valid data
      if (Array.isArray(response.data.listing_list)) {
        setCarListings(response.data.listing_list);
        setFilteredCarListings(response.data.listing_list);
      } else {
        setErrorMessage('Failed to load car listings. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setErrorMessage(error.response?.data?.error || 'An error occurred while fetching car listings.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run fetchListings when access_token is available
  useEffect(() => {
    if (access_token) {
      fetchListings();
    } else {
      setErrorMessage("You need to log in to view listings.");
    }
  }, [access_token]);

  // Dropdown options for filters
  const filterData = {
    Mileage: ["Under 20,000 km", "20,000 - 50,000 km", "50,000 - 100,000 km", "Over 100,000 km"],
    Price: ["Under $10,000", "$10,000 - $20,000", "$20,000 - $30,000", "Over $30,000"],
    year: [...yearOptions, "Older"], // Dynamic years plus the 'Older' option
    Availability: ["Available", "Sold Out"],
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    filterCarListings(e.target.value, selectedFilters); // Filter on input change
  };

  // Handle filter option change
  const handleFilterChange = (filterCategory, value) => {
    const updatedFilters = { ...selectedFilters, [filterCategory]: value };
    setSelectedFilters(updatedFilters); // Update selected filters
    filterCarListings(searchInput, updatedFilters); // Apply filters
    toggleDropdownVisibility(filterCategory); // Close dropdown after selection
  };

 // Toggle visibility of filter dropdown
const toggleDropdownVisibility = (filterCategory) => {
  setDropdownVisibility((prevVisibility) => {
    // Create a new object to ensure immutability
    const newVisibility = { ...prevVisibility };

    // Hide all dropdowns and show only the selected one
    Object.keys(newVisibility).forEach((key) => {
      if (key !== filterCategory) {
        newVisibility[key] = false; // Hide other dropdowns
      }
    });

    // Toggle the visibility of the selected dropdown
    newVisibility[filterCategory] = !newVisibility[filterCategory];

    return newVisibility;
  });
};


 // Updated filterCarListings function with fixes
const filterCarListings = (searchKeyword, filters) => {
  let filtered = carListings;

  // Filter by search keyword (case-insensitive match on any part of make or model)
  if (searchKeyword) {
    const keywordLower = searchKeyword.toLowerCase();
    filtered = filtered.filter(car =>
      car.model.toLowerCase().includes(keywordLower) ||
      car.make.toLowerCase().includes(keywordLower)
    );
  }

  // Apply additional filters (price, mileage, year, availability)
  Object.keys(filters).forEach((filterCategory) => {
    const filterValue = filters[filterCategory];
    if (filterValue) {
      filtered = filtered.filter(car => {
        if (filterCategory === "Price") {
          if (filterValue === "Under $10,000" && car.price < 10000) return true;
          if (filterValue === "$10,000 - $20,000" && car.price >= 10000 && car.price <= 20000) return true;
          if (filterValue === "$20,000 - $30,000" && car.price >= 20000 && car.price <= 30000) return true;
          if (filterValue === "Over $30,000" && car.price > 30000) return true;
        }
        if (filterCategory === "Mileage") {
          if (filterValue === "Under 20,000 km" && car.mileage < 20000) return true;
          if (filterValue === "20,000 - 50,000 km" && car.mileage >= 20000 && car.mileage <= 50000) return true;
          if (filterValue === "50,000 - 100,000 km" && car.mileage >= 50000 && car.mileage <= 100000) return true;
          if (filterValue === "Over 100,000 km" && car.mileage > 100000) return true;
        }
        if (filterCategory === "Year") {
          // Handle the "Older" filter
          if (filterValue === "Older" && car.year < currentYear - 5) return true;

          // Otherwise, compare the selected year to the car's year
          const filterYear = parseInt(filterValue, 10);
          if (!isNaN(filterYear) && car.year === filterYear) return true;
        }
        if (filterCategory === "Availability") {
          // Assuming `is_sold` is the field for availability
          if (filterValue === "Available" && !car.is_sold) return true;
          if (filterValue === "Sold Out" && car.is_sold) return true;
        }
        return false; // If none of the conditions match, exclude the car
      });
    }
  });

  // Ensure filteredCarListings is always an array
  setFilteredCarListings(filtered.length ? filtered : []);
};


  // Handle car image or details click
  const handleCarClick = (id) => {
    if (!access_token) {
      window.location.href = '/pages/login'; // Redirect to login page if not authenticated
    } else {
      router.push(`/buyer/listing/${id}`); // Navigate to car details page
    }
  };

  return (
    <div className="bg-[#f0f0f7] font-rajdhaniSemiBold min-h-screen">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-orange-100">
        <h1 className="text-4xl font-rajdhaniBold text-[#f75049]">WELCOME TO THE BUYER PAGE</h1>
        <p className="mt-2 text-lg text-[#f75049]">Drive an EV for Free! Sell us your car and drive home any of our electric vehicles for a 7-day test drive!</p>
      </div>

      <div className="flex flex-col items-center mt-8 px-4">
        <input
          type="text"
          placeholder="What car are you searching for?"
          className="w-full max-w-lg p-2 mb-4 border border-gray-300 rounded text-black"
          value={searchInput}
          onChange={handleSearchChange}
        />
        <div className="flex space-x-2">
          {Object.keys(filterData).map((filter) => (
            <div key={filter} className="relative group">
              <button 
                className="bg-gray-200 px-3 py-1 rounded" 
                onClick={() => toggleDropdownVisibility(filter)}
              >
                {filter}
              </button>
              {dropdownVisibility[filter] && (
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg">
                  {filterData[filter].map((option) => (
                    <div 
                      key={option} 
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100" 
                      onClick={() => handleFilterChange(filter, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-solid border-gray-300 border-t-[#f75049]"></div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {errorMessage ? (
          // This error message will display if there's a failure fetching listings
          <div className="w-full text-center text-red-500">{errorMessage}</div>
        ) : filteredCarListings.length === 0 ? (
          // This message will display if there are no listings after applying filters or on initial load
          <div className="w-full text-center text-gray-500">No car listings found.</div>
        ) : (
          filteredCarListings.map((car) => (
            <div key={car.id} className="bg-white border rounded shadow-md overflow-hidden">
                <img
                    src={car.image_url ? `http://localhost:5000/uploads/${car.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 object-cover"
                    onClick={() => handleCarClick(car.id)}
                />
              <div className="p-4">
                <h3 className="text-lg text-black font-bold">{car.make} {car.model} ({car.year})</h3>
                <div className="mt-2 text-sm text-gray-500">
                  Price: ${car.price.toLocaleString()}
                  <br />
                  Mileage: {car.mileage.toLocaleString()} km
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="bg-[#f75049] text-white py-1 px-4 rounded"
                    onClick={() => handleCarClick(car.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}