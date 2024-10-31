import React from 'react';
import { FaCar, FaTachometerAlt, FaGasPump } from 'react-icons/fa';

export function ListingCard({
  imageSrc,
  make,
  model,
  year,
  price,
  mileage,
  transmission,
  fuelType,
}) {
  return (
    <div className="flex p-6 bg-gray-100 rounded-lg shadow-md w-[48rem]"> {/* Increased width to 48rem */}
      {/* Image Section */}
      <div className="w-1/4"> {/* Adjusted to take 1/4 of the space */}
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
          {/* Transmission */}
          <div className="flex items-center space-x-1">
            <FaCar />
            <span>{transmission || 'N/A'}</span>
          </div>

          {/* Mileage */}
          <div className="flex items-center space-x-1">
            <FaTachometerAlt />
            <span>{mileage ? `${mileage.toLocaleString()} km` : 'N/A'}</span>
          </div>

          {/* Fuel Type */}
          <div className="flex items-center space-x-1">
            <FaGasPump />
            <span>{fuelType || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
