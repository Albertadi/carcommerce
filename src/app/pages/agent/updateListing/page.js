"use client";
import { useContext, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '../../../authorization/AuthContext';
import axios from 'axios';

export default function UpdateListing() {
  const { access_token } = useContext(AuthContext);
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
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
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/listing/search_listing',
          { id: params.id },
          { headers: { Authorization: `Bearer ${access_token}` } }
        );
        
        const listing = response.data.listing_list[0];
        if (listing) {
          setFormData({
            vin: listing.vin,
            make: listing.make,
            model: listing.model,
            year: listing.year.toString(),
            price: listing.price.toString(),
            mileage: listing.mileage.toString(),
            transmission: listing.transmission,
            fuel_type: listing.fuel_type,
            seller_email: listing.seller_email
          });
          if (listing.image_url) {
            setCurrentImageUrl(`http://localhost:5000/uploads/${listing.image_url}`);
          }
        }
      } catch (error) {
        setError('Failed to fetch listing details');
        console.error('Error fetching listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id, access_token]);

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
      setCurrentImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setImage(null);
    setCurrentImageUrl('');
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
    formSubmissionData.append('id', params.id);

    Object.entries(formData).forEach(([key, value]) => {
      formSubmissionData.append(key, value);
    });

    if (image) {
      formSubmissionData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/listing/update_listing', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formSubmissionData,
      });

      if (response.ok) {
        alert('Listing updated successfully!');
        router.push('../viewListings');
      } else {
        const error = await response.json();
        console.error('Error details:', error);
        alert(`Error: ${error.message || 'An error occurred while updating the listing.'}`);
      }
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('An unexpected error occurred.');
    }
  };

  const years = Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f75049]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-rajdhaniBold mb-6 text-center">Update Car Listing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload Section */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-gray-700 font-rajdhaniSemiBold mb-2">Upload Car Image</label>
            <div className="flex items-center justify-center">
              {(currentImageUrl || image) ? (
                <div className="relative flex items-center justify-center w-full max-w-lg h-auto">
                  <img
                    src={currentImageUrl}
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

          {/* Form Section - Reuse the same form structure as createListing */}
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
                Update Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}