"use client"; // Mark as Client Component

import { useContext, useState } from 'react';
import { AuthContext } from './pages/authorization/AuthContext'; // Adjust path as needed
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, token } = useContext(AuthContext); // Access user and token from context
  const [filterOptions, setFilterOptions] = useState({});
  const [searchInput, setSearchInput] = useState(''); // State for search input
  const router = useRouter(); // Initialize router

  // Hardcoded car listings
  const carListings = [
    {
      id: 1,
      model: 'Tesla Model S',
      year: '2023',
      price: '$99,990',
      image: 'https://www.usnews.com/object/image/0000018d-a43a-dcce-adfd-b53ebb720000/models-70.jpg?update-time=1707857328487&size=responsive640',
    },
    {
      id: 2,
      model: 'Ford Mustang',
      year: '2022',
      price: '$45,000',
      image: 'https://img.remediosdigitales.com/f0ed7f/ford-mustang-gt-350/450_1000.jpg',
    },
    {
      id: 3,
      model: 'BMW 3 Series',
      year: '2021',
      price: '$39,500',
      image: 'https://di-uploads-pod19.dealerinspire.com/bmwofmanhattan/uploads/2021/05/2020-BMW-3-Series-4-smaller.jpg',
    },
  ];
  

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
      window.location.href = '/pages/login';
    } else {
      router.push('/pages/buyer'); // Navigate to the buyer page
    }
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle key press event
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!token) {
        // Redirect to login page if not authenticated
        window.location.href = '/pages/login';
      } else {
        // Implement search functionality or redirect as needed
        console.log('Search for:', searchInput); // For now, log the search input
      }
    }
  };

  const carLogos = [
    { id: 1, src: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png', alt: 'Tesla' },
    { id: 2, src: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg', alt: 'Ford' },
    { id: 3, src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', alt: 'BMW' },
    { id: 4, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Audi-Logo_2016.svg/640px-Audi-Logo_2016.svg.png', alt: 'Audi' },
    { id: 5, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Cars_Logo_Black.svg/640px-Cars_Logo_Black.svg.png', alt: 'Cars' },
    { id: 6, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/640px-Honda_Logo.svg.png', alt: 'Honda' },
    { id: 7, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Volkswagen_Logo_till_1995.svg/640px-Volkswagen_Logo_till_1995.svg.png', alt: 'Volkswagen' },
    { id: 8, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/DSC00458_%287614921264%29.jpg/640px-DSC00458_%287614921264%29.jpg', alt: 'Ferrari' },
    { id: 9, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Toyota_logo_%28Red%29.svg/640px-Toyota_logo_%28Red%29.svg.png', alt: 'Toyota' },

  ];

  return (
    <div className="bg-[#f0f0f7] font-rajdhaniSemiBold min-h-screen">

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center p-8 bg-orange-100">
        <h1 className="text-4xl font-rajdhaniBold text-[#f75049]">WELCOME TO THE HOME PAGE</h1>
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
              onMouseLeave={() => handleMouseLeave(filter)} // Trigger mouse leave only on the container
            >
              <button className="bg-gray-200 px-3 py-1 rounded">{filter}</button>
              
              {filterOptions[filter] && (
                <div 
                  className="absolute z-10 w-48 bg-white border border-gray-300 rounded shadow-lg pt-2" // Added padding-top for buffer
                  style={{ top: '100%' }} // Position dropdown directly below the button
                >
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
          {carListings.map(car => (
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
          ))}
        </div>
        

      {/* Infinite Scrolling Logo Section */}
      <div className="overflow-hidden py-6 mt-8">
        <div className="flex animate-scroll space-x-12">
          {[...carLogos, ...carLogos, ...carLogos].map((logo, index) => ( // Duplicate logos multiple times for seamless loop
            <img
              key={index}
              src={logo.src}
              alt={logo.alt}
              className="w-36 h-36 object-contain mx-4" // Adjust spacing between logos
            />
          ))}
        </div>
      </div>

      {/* CSS for Infinite Scrolling Animation */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
          display: flex;
        }
      `}</style>
      </div>
    </div>
  );
}
