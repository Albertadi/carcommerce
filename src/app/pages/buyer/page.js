"use client"; // Mark as Client Component

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authorization/AuthContext';
import { useRouter } from "next/navigation";
import { Heart } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function BuyerPage() {
  const { access_token } = useContext(AuthContext);
  const [searchInput, setSearchInput] = useState('');
  const [carListings, setCarListings] = useState([]);
  const [filteredCarListings, setFilteredCarListings] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dropdownVisibility, setDropdownVisibility] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [invalidMessage, setInvalidMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortlistedCars, setShortlistedCars] = useState(new Set());
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);


  const buildSearchFilters = () => {
    const filters = {};
    if (searchInput) filters.search = searchInput;
    if (selectedFilters.Price) filters.price = selectedFilters.Price;
    if (selectedFilters.Mileage) filters.mileage = selectedFilters.Mileage;
    if (selectedFilters.Year) filters.year = selectedFilters.year;
    if (selectedFilters.Availability) filters.availability = selectedFilters.Availability;
    return filters;
  };

  const handleShortlist = async (listingId, sellerEmail, e) => {
    e.stopPropagation(); // Prevent card click

    if (shortlistedCars.has(listingId)) {
      return; // Already shortlisted
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/shortlist/saveto_shortlist',
        {
          listing_id: listingId,
          seller_email: sellerEmail
        },
        {
          headers: { 
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setShortlistedCars(prev => new Set([...prev, listingId]));
        setSuccessMessage('Added to shortlist successfully!');
        setTimeout(() => {
          setSuccessMessage(''); // Clear the message after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      setInvalidMessage(error.response?.data?.error || 'Failed to add to shortlist');
      setTimeout(() => {
        setInvalidMessage(''); // Clear the message after 3 seconds
      }, 3000);
    }
  };

  const fetchListings = async () => {
    setIsLoading(true);
    setErrorMessage('');
    const filters = buildSearchFilters();
    console.log('Sending filters to API:', filters);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/listing/search_listing',
        filters,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

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

  useEffect(() => {
    if (access_token) {
      fetchListings();
    } else {
      setErrorMessage("You need to log in to view listings.");
    }
  }, [access_token]);

  const filterData = {
    Mileage: ["Under 20,000 km", "20,000 - 50,000 km", "50,000 - 100,000 km", "Over 100,000 km"],
    Price: ["Under $10,000", "$10,000 - $20,000", "$20,000 - $30,000", "Over $30,000"],
    Year: [...yearOptions, "Older"],
    Availability: ["Available", "Sold Out"],
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    filterCarListings(e.target.value, selectedFilters);
  };

  const handleFilterChange = (filterCategory, value) => {
    const updatedFilters = { ...selectedFilters, [filterCategory]: value };
    setSelectedFilters(updatedFilters);
    filterCarListings(searchInput, updatedFilters);
    toggleDropdownVisibility(filterCategory);
  };

  const toggleDropdownVisibility = (filterCategory) => {
    setDropdownVisibility((prevVisibility) => {
      const newVisibility = { ...prevVisibility };
      Object.keys(newVisibility).forEach((key) => {
        if (key !== filterCategory) {
          newVisibility[key] = false;
        }
      });
      newVisibility[filterCategory] = !newVisibility[filterCategory];
      return newVisibility;
    });
  };

  const filterCarListings = (searchKeyword, filters) => {
    let filtered = carListings;

    if (searchKeyword) {
      const keywordLower = searchKeyword.toLowerCase();
      filtered = filtered.filter(car =>
        car.model.toLowerCase().includes(keywordLower) ||
        car.make.toLowerCase().includes(keywordLower)
      );
    }

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
            if (filterValue === "Older" && car.year < currentYear - 5) return true;
            const filterYear = parseInt(filterValue, 10);
            if (!isNaN(filterYear) && car.year === filterYear) return true;
          }
          if (filterCategory === "Availability") {
            if (filterValue === "Available" && !car.is_sold) return true;
            if (filterValue === "Sold Out" && car.is_sold) return true;
          }
          return false;
        });
      }
    });

    setFilteredCarListings(filtered.length ? filtered : []);
  };

  const handleCarClick = async (id) => {
    if (!access_token) {
      window.location.href = '/pages/login';
      return;
    }
  
    try {
      // First increment the views
      await axios.post(
        'http://localhost:5000/api/views/increment_views',
        { listing_id: id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Then navigate to the listing details
      router.push(`/pages/buyer/listing/${id}`);
    } catch (error) {
      console.error('Error:', error);
      // Still navigate even if view increment fails
      router.push(`/pages/buyer/listing/${id}`);
    }
  };

  return (
    <div className="bg-[#f0f0f7] font-rajdhaniSemiBold min-h-screen">
      <div className="flex flex-col items-center justify-center text-center p-8 bg-[#f75049] h-64">
        <h1 className="text-4xl font-rajdhaniBold text-white">WELCOME TO THE BUYER PAGE</h1>
        <p className="mt-2 text-lg text-white">Explore Your Dream Car with Real-Time Analytics and Exclusive Listings</p>
      </div>
      {/* Success message display */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}

        {/* Info message display */}
        {invalidMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {invalidMessage}
          </div>
        )}
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
          <div className="w-full text-center text-red-500">{errorMessage}</div>
        ) : filteredCarListings.length === 0 ? (
          <div className="w-full text-center text-gray-500">No car listings found.</div>
        ) : (
          filteredCarListings.map((car) => (
            <div key={car.id} className="bg-white border rounded shadow-md overflow-hidden relative">
              <button 
                onClick={(e) => handleShortlist(car.id, car.seller_email, e)}
                className={`absolute top-4 right-4 p-2 rounded-full bg-white shadow-md z-10 
                  transition-all duration-200 hover:transform hover:scale-110
                  ${shortlistedCars.has(car.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                disabled={shortlistedCars.has(car.id)}
              >
                <Heart 
                  size={20} 
                  className={shortlistedCars.has(car.id) ? 'fill-current' : ''}
                />
              </button>

              <img
                src={car.image_url ? `http://localhost:5000/uploads/${car.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover object-center cursor-pointer"
                onClick={() => handleCarClick(car.id)}
              />

              <div className="p-4">
                <h3 className="text-lg text-black font-rajdhaniBold">{car.year} {car.make} {car.model}</h3>
                <div className="mt-2 text-sm font-rajdhaniSemiBold text-lg text-gray-500">
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