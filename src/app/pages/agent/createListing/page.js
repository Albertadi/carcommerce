"use client";
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../authorization/AuthContext';
import React from 'react';

export default function CreateListing() {
  const { access_token } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();
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
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload a PNG or JPEG image.');
        setImage(null);
        return;
      }
      setImage(file);
    }
  };

  const handleImageDelete = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = Object.values(formData).every((field) => field !== '');
    if (!isValid) {
      alert('Please fill out all fields.');
      return;
    }

    if (isNaN(formData.price) || isNaN(formData.mileage)) {
      alert('Price and Mileage must be valid numbers.');
      return;
    }

    const formSubmissionData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formSubmissionData.append(key, value);
    });

    if (image) {
      formSubmissionData.append('image', image);
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
        setSuccessMessage('Listing created successfully!!!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000)

        setFormData({
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
        setImage(null);
        router.push('../agent/dashboard');  // Redirect to the dashboard page
      } else {
        const error = await response.json();
        console.error('Error details:', error);
        alert(`Error: ${error.message || 'An error occurred while creating the listing.'}`);
      }
    } catch (error) {
      console.error('Failed to submit listing:', error);
      alert('An unexpected error occurred.');
    }
  };


  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Add the success message here, right after the opening div */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-500">
          {successMessage}
        </div>
      )}
      <div className="bg-white p-8 shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-rajdhaniBold mb-6 text-center">Create Car Listing</h2>

        {/* Grid layout for upload box and form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Image Upload Section */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-rajdhaniSemiBold mb-2">Upload Car Image</label>
            <div className="flex items-center justify-center">
              {image ? (
                <div className="relative flex items-center justify-center w-full max-w-lg h-auto">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Car image preview"
                    className="max-w-full max-h-48 rounded shadow-lg object-contain"
                  />
                  <button
                    onClick={handleImageDelete}
                    className="absolute top-2 right-2 font-rajdhaniSemiBold bg-[#f75049] text-white rounded p-1"
                    style={{ fontSize: '18px' }}
                  >
                    &nbsp; X &nbsp;
                  </button>
                </div>
              ) : (
                <label
                  className="flex items-center font-rajdhaniSemiBold justify-center w-full h-48 rounded bg-[#f75049]/25 text-[#f75049] text-6xl cursor-pointer"
                  style={{ border: '3px solid #f75049' }}
                >
                  +
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Year Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option className="font-rajdhaniSemiBold" value="">Select Year</option>
                {years.map((year) => (
                  <option className="font-rajdhaniSemiBold" key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Make Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Enter Car Make"
                className="w-full px-4 font-rajdhaniSemiBold py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Model Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter Car Model"
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Transmission Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option className="font-rajdhaniSemiBold" value="">Select Transmission</option>
                <option className="font-rajdhaniSemiBold" value="AUTOMATIC">AUTOMATIC</option>
                <option className="font-rajdhaniSemiBold" value="MANUAL">MANUAL</option>
              </select>
            </div>

            {/* Mileage Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Mileage</label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="Enter Car Mileage"
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Fuel Type Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Fuel</label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              >
                <option className="font-rajdhaniSemiBold" value="">Select Fuel Type</option>
                <option className="font-rajdhaniSemiBold" value="PETROL">PETROL</option>
                <option className="font-rajdhaniSemiBold" value="DIESEL">DIESEL</option>
                <option className="font-rajdhaniSemiBold" value="ELECTRIC">ELECTRIC</option>
                <option className="font-rajdhaniSemiBold" value="HYBRID">HYBRID</option>
              </select>
            </div>

            {/* Price Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Price</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                placeholder="Enter Price"
                onChange={handleChange}
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* VIN Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">VIN</label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                placeholder="Enter VIN"
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Seller Email Field */}
            <div>
              <label className="block font-rajdhaniSemiBold text-gray-700">Seller Email</label>
              <input
                type="text"
                name="seller_email"
                value={formData.seller_email}
                onChange={handleChange}
                placeholder="Enter Sellers' Email"
                className="w-full px-4 py-2 font-rajdhaniSemiBold border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#f75049] font-rajdhaniSemiBold text-white text-xl rounded hover:bg-[#5ef6ff] transition-colors"
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
