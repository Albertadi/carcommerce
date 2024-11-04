import React from 'react';
import { FaUserCircle, FaStar } from 'react-icons/fa';

export function ReviewCard({ name = "John Doe", review = "Review Here", rating = 3.5 }) {
  return (
    <div className="flex items-center p-4 bg-gray-200 rounded-lg shadow-md w-[40rem]">
      <div className="flex items-center">
        <FaUserCircle className="text-red-700 text-5xl mr-4" />
      </div>
      <div className="flex-1">
        <p className="text-black font-semibold">{name}</p>
        <p className="text-gray-700">{review}</p>
      </div>
      <div className="flex items-center ml-4">
        <FaStar className="text-black text-xl" />
        <span className="text-red-600 text-lg font-semibold ml-1">{rating}</span>
      </div>
    </div>
  );
}
