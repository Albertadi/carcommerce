import React from 'react';
import { FaCar, FaTachometerAlt, FaGasPump } from 'react-icons/fa';
import PropTypes from 'prop-types';

export function ListingCard({
  imageSrc,
  make,
  model,
  year,
  price,
  mileage,
  transmission,
  fuelType,
  agentEmail,
  sellerEmail,
  isSold,
  listingDate,
  vin,
  dashboardType, // Determines if user is a buyer, seller, or agent
  onMarkAsSold, // Handler for marking as sold
  onUpdateListing, // Handler for updating the listing
}) {
  return (
    <div className="flex p-6 bg-gray-100 rounded-lg shadow-md w-[48rem]">
      {/* Image Section */}
      <div className="w-1/4">
        <img src={imageSrc} alt="Listing" className="rounded-lg object-cover w-full h-40" />
      </div>

      {/* Details Section */}
      <div className="flex-1 pl-6">
        {/* Title and Price */}
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-black">{`${make} ${model} ${year}`}</p>
          <div className="text-right">
            <p className="text-red-600 font-bold text-xl">${price?.toLocaleString()}</p>
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center text-gray-700 mt-3 space-x-6">
          <div className="flex items-center space-x-1">
            <FaCar />
            <span>{transmission || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaTachometerAlt />
            <span>{mileage ? `${mileage.toLocaleString()} km` : 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaGasPump />
            <span>{fuelType || 'N/A'}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-gray-600">
          <p>VIN: {vin || 'N/A'}</p>
          <p>Agent Email: {agentEmail || 'N/A'}</p>
          <p>Seller Email: {sellerEmail || 'N/A'}</p>
          <p>Listing Date: {new Date(listingDate).toLocaleDateString() || 'N/A'}</p>
          <p>Status: {isSold ? 'Sold' : 'Available'}</p>
        </div>

        {/* Action Buttons based on dashboardType */}
        <div className="mt-4">
          {dashboardType === 'seller' && !isSold && (
            <button
              onClick={onMarkAsSold}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            >
              Mark as Sold
            </button>
          )}
          {dashboardType === 'agent' && (
            <button
              onClick={onUpdateListing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update Listing
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// PropTypes for type-checking
ListingCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  make: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  mileage: PropTypes.number.isRequired,
  transmission: PropTypes.string,
  fuelType: PropTypes.string,
  agentEmail: PropTypes.string,
  sellerEmail: PropTypes.string,
  isSold: PropTypes.bool,
  listingDate: PropTypes.string,
  vin: PropTypes.string,
  dashboardType: PropTypes.oneOf(['buyer', 'seller', 'agent']),
  onMarkAsSold: PropTypes.func,
  onUpdateListing: PropTypes.func,
};

ListingCard.defaultProps = {
  transmission: 'N/A',
  fuelType: 'N/A',
  agentEmail: '',
  sellerEmail: '',
  isSold: false,
  listingDate: '',
  vin: '',
  dashboardType: 'buyer',
  onMarkAsSold: () => {},
  onUpdateListing: () => {},
};
