"use client";
import { useContext, useState } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import React from 'react';

export default function CreateListing() {
  const { access_token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    vin: '',
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: '',
    fuel_type: '',
    seller_email: ''
  });
  const [image, setImage] = useState(null); // Store a single image file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get only the first file
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a PNG or JPEG image.');
        setImage(null); // Clear the image state
        return;
      }
      setImage(file); // Store the single file
    }
  };

  const handleImageDelete = () => {
    setImage(null); // Remove the image
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = Object.values(formData).every((field) => field !== '');
    if (!isValid) {
      alert('Please fill out all fields.');
      return;
    }

    const formSubmissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formSubmissionData.append(key, value);
    });

    if (image) {
      formSubmissionData.append('image', image); // Change 'images' to 'image'
    }

    try {
      const response = await fetch('http://localhost:5000/api/listing/create_listing', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formSubmissionData,
      });

      if (response.ok) {
        alert('Listing created successfully!');
      } else {
        const error = await response.json();
        console.error('Error details:', error); // Log the error details
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Failed to submit listing:', error);
    }
  };

  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Car Listing</h2>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Car Image</label>
          <div className="flex items-center space-x-4">
            <label
              className="flex items-center justify-center w-24 h-24 rounded-lg bg-blue-100 text-blue-500 text-2xl cursor-pointer"
              style={{ border: '2px dashed #3b82f6' }}
            >
              +
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <div className="flex overflow-x-scroll space-x-4 py-2">
              {image && (
                <div className="relative group w-24 h-24 flex-shrink-0">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Car image preview"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <button
                    onClick={handleImageDelete}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontSize: '12px' }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Transmission</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select Transmission</option>
              <option value="Automatic">AUTOMATIC</option>
              <option value="Manual">MANUAL</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Mileage</label>
            <input
              type="text"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Fuel</label>
            <select
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select Fuel Type</option>
              <option value="PETROL">PETROL</option>
              <option value="DIESEL">DIESEL</option>
              <option value="ELECTRIC">ELECTRIC</option>
              <option value="HYBRID">HYBRID</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">VIN</label>
            <input
              type="text"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Seller Email</label>
            <input
              type="text"
              name="seller_email"
              value={formData.seller_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
