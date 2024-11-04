// src/app/pages/agent/createListing/page.js
"use client";

import React, { useState } from 'react';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    customMake: '',
    modelVariant: '',
    transmission: '',
    engineCapacity: '',
    color: '',
    carBodyType: '',
    fuel: '',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      Make: formData.Make === "Other" ? formData.customMake : formData.Make,
    };
    console.log(submittedData);
    // Add your form submission logic here
  };

  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

  const Makes = [
    "Abarth", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Buick", "BYD", "Cadillac", "Chery",
    "Chevrolet", "Chrysler", "Daihatsu", "Dodge", "Ferrari", "Ford", "Foton", "Geely", "Hino", "Honda",
    "Hummer", "Hyundai", "Isuzu", "Jaguar", "Jeep", "KIA", "Lamborghini", "Land Rover", "Lexus", "Maserati",
    "Mazda", "Mercedes-Benz", "MINI", "Mitsubishi", "Nissan", "Peugeot", "Porsche", "Proton", "Rolls-Royce",
    "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "UD Trucks", "Volkswagen", "Volvo", "Other"
  ];

  const fuels = ["Diesel", "Gasoline", "Hybrid", "Electric"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Post Your Car</h2>

        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload Car Images</label>
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <label
              className="flex items-center justify-center w-24 h-24 rounded-lg bg-blue-100 text-blue-500 text-2xl cursor-pointer"
              style={{ border: '2px dashed #3b82f6' }}
            >
              +
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            <div className="flex overflow-x-scroll space-x-4 py-2">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="relative group w-24 h-24 flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => handleImageDelete(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontSize: '12px' }}
                  >
                    X
                  </button>
                </div>
              ))}
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
            <label className="block text-gray-700">Make/Brand</label>
            <select
              name="make"
              value={formData.Make}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select Make</option>
              {Makes.map((Make) => (
                <option key={Make} value={Make}>
                  {Make}
                </option>
              ))}
            </select>
            {formData.Make === "Other" && (
              <input
                type="text"
                name="customMake"
                value={formData.customMake}
                onChange={handleChange}
                placeholder="Enter custom Make"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700">Model or Variant</label>
            <input
              type="text"
              name="modelVariant"
              value={formData.modelVariant}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Transmission</label>
            <input
              type="text"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Engine Capacity</label>
            <input
              type="text"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Mileage</label>
            <input
              type="text"
              name="Mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Car Body Type</label>
            <input
              type="text"
              name="carBodyType"
              value={formData.carBodyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Fuel</label>
            <select
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            >
              <option value="">Select Fuel Type</option>
              {fuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              name="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Submit Listing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
