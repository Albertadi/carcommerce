import React from 'react';
import PropTypes from 'prop-types';
import { FaCar, FaTachometerAlt, FaGasPump, FaTag } from 'react-icons/fa';

export function ListingCard({
  imageSrc,
  make,
  model,
  year,
  price,
  mileage,
  transmission,
  fuelType,
  dashboardType,
  onViewDetails,
  onDelete,
  isSold,
}) {
  return (
    <div className="flex p-4 bg-white rounded-lg shadow-md relative">
      {/* Image Section */}
      <div className="w-40 h-40 flex-shrink-0 mr-4 overflow-hidden rounded-md shadow-md">
        <img
          src={imageSrc || 'https://dummyimage.com/300x300/000/fff&text=Car'}
          alt={`${make} ${model}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details Section */}
      <div className="flex-1">
        {/* Title and Year */}
        <h3 className="text-xl font-rajdhaniBold text-gray-800 mb-2">
          {year} {make} {model}
        </h3>

        {/* Mileage, Transmission, Fuel Type, and Price */}
        <div className="text-gray-600 space-y-1">
          <p className="flex items-center">
            <FaTachometerAlt className="mr-2 text-gray-500" /> 
            <span className="font-rajdhaniBold">Mileage:</span> <span className="font-rajdhaniSemiBold">{mileage?.toLocaleString()} km</span>
          </p>
          <p className="flex items-center">
            <FaCar className="mr-2 text-gray-500" /> 
            <span className="font-rajdhaniBold">Transmission:</span> <span className="font-rajdhaniSemiBold">{transmission || 'N/A'}</span>
          </p>
          <p className="flex items-center">
            <FaGasPump className="mr-2 text-gray-500" /> 
            <span className="font-rajdhaniBold">Fuel Type:</span> <span className="font-rajdhaniSemiBold">{fuelType || 'N/A'}</span>
          </p>
          <p className="flex items-center text-red-600 text-lg font-rajdhaniBold">
            <FaTag className="mr-2" /> 
            ${price?.toLocaleString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={onViewDetails}
            className="bg-blue-500 text-white font-rajdhaniSemiBold py-1 px-3 rounded flex items-center hover:bg-blue-600"
          >
            <span>View Details</span>
          </button>
          {dashboardType === 'agent' && (
            <button
              onClick={onDelete}
              className="bg-red-500 text-white py-1 px-3 rounded flex items-center hover:bg-red-600"
            >
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// PropTypes for type-checking
ListingCard.propTypes = {
  imageSrc: PropTypes.string,
  make: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  mileage: PropTypes.number,
  transmission: PropTypes.string,
  fuelType: PropTypes.string,
  dashboardType: PropTypes.oneOf(['buyer', 'seller', 'agent']),
  onViewDetails: PropTypes.func,
  onDelete: PropTypes.func,
  isSold: PropTypes.bool,
};

ListingCard.defaultProps = {
  imageSrc: '',
  mileage: 0,
  transmission: 'N/A',
  fuelType: 'N/A',
  dashboardType: 'buyer',
  onViewDetails: () => {},
  onDelete: () => {},
  isSold: false,
};
