"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import axios from 'axios';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token, user } = useContext(AuthContext);
    const [showFilters, setShowFilters] = useState(false); // Toggle state for filters

    // Search filter state
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minMileage, setMinMileage] = useState('');
    const [maxMileage, setMaxMileage] = useState('');
    const [transmission, setTransmission] = useState('');
    const [fuelType, setFuelType] = useState('');
    const [isSold, setIsSold] = useState(false);
    const [sellerEmail, setSellerEmail] = useState('');

    const agentEmail = user?.email || '';

    // Modal state for viewing details
    const [showViewDetails, setViewDetailsModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    // modal for delete
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);

    // Validation state
    const [priceError, setPriceError] = useState({ min: '', max: '' });
    const [mileageError, setMileageError] = useState({ min: '', max: '' });
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const buildSearchFilters = () => {
        const filters = {};
        if (make) filters.make = make;
        if (model) filters.model = model;
        if (year) filters.year = year;
        if (minPrice) filters.min_price = minPrice;
        if (maxPrice) filters.max_price = maxPrice;
        if (minMileage) filters.min_mileage = minMileage;
        if (maxMileage) filters.max_mileage = maxMileage;
        if (transmission) filters.transmission = transmission;
        if (fuelType) filters.fuel_type = fuelType;
        if (isSold !== undefined) filters.is_sold = isSold;
        if (sellerEmail) filters.seller_email = sellerEmail;
        if (agentEmail) filters.agent_email = agentEmail;
        return filters;
    };


    const fetchListings = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/listing/search_listing',
                buildSearchFilters(),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setListings(response.data.listing_list);
        } catch (error) {
            setError('Failed to fetch listings. Please try again.');
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
            setShowFilters(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, [token]);

    const handleInputChange = (setter, errorSetter, field) => (e) => {
        let value = e.target.value;
    
        // Remove any non-numeric characters except the decimal point for price
        if (field.includes("Price")) {
            value = value.replace(/[^0-9.]/g, '');
        } else {
            value = value.replace(/[^0-9]/g, ''); // Remove decimals for mileage
        }
    
        // Enforce minimum and maximum constraints
        if (field === 'minPrice' || field === 'maxPrice') {
            if (parseFloat(value) < 0) value = "0";
            else if (parseFloat(value) > 9999999) value = "9999999";
        } else if (field === 'minMileage' || field === 'maxMileage') {
            if (parseInt(value) < 0) value = "0";
            else if (parseInt(value) > 1000000) value = "1000000";
        }
    
        // Format the value with commas for display purposes
        const formattedValue = value ? (field.includes("Price") ? parseFloat(value).toLocaleString() : parseInt(value).toLocaleString()) : '';
    
        // Set the formatted value in state for display
        setter(formattedValue);
    
        // Store the raw value for submission (without commas)
        const rawValue = field.includes("Price") ? parseFloat(value) || 0 : parseInt(value) || 0;
    
        // Save raw value for submission (you might need to adjust where you store this)
        // You might want to save rawValue in another state variable if needed.
    
        errorSetter((prev) => ({ ...prev, [field]: '' })); // Clear the error for the specific field
    };
    
    // Validate prices
    const validatePrices = () => {
        let valid = true;
    
        // Validate min price
        if (minPrice && isNaN(minPrice.replace(/,/g, ''))) {
            setPriceError((prev) => ({ ...prev, min: 'Min Price must be a number' }));
            valid = false;
        } else if (parseFloat(minPrice.replace(/,/g, '')) < 0) {
            setPriceError((prev) => ({ ...prev, min: 'Min Price cannot be less than 0' }));
            valid = false;
        } else if (maxPrice && parseFloat(minPrice.replace(/,/g, '')) > parseFloat(maxPrice.replace(/,/g, ''))) {
            setPriceError((prev) => ({ ...prev, min: 'Min Price cannot be greater than Max Price' }));
            valid = false;
        } 
        else if (parseFloat(minPrice.replace(/,/g, '')) > 9999999) {
                setPriceError((prev) => ({ ...prev, min: 'Min Price cannot exceed 9,999,999' }));
                valid = false;
        }
        else {
            setPriceError((prev) => ({ ...prev, min: '' }));
        }
    
        // Validate max price
        if (maxPrice && isNaN(maxPrice.replace(/,/g, ''))) {
            setPriceError((prev) => ({ ...prev, max: 'Max Price must be a number' }));
            valid = false;
        } else if (parseFloat(maxPrice.replace(/,/g, '')) > 9999999) {
            setPriceError((prev) => ({ ...prev, max: 'Max Price cannot exceed 9,999,999' }));
            valid = false;
        } else {
            setPriceError((prev) => ({ ...prev, max: '' }));
        }
    
        return valid;
    };
    
    // Validate mileages
    const validateMileages = () => {
        let valid = true;
    
        // Validate min mileage
        if (minMileage && isNaN(minMileage.replace(/,/g, ''))) {
            setMileageError((prev) => ({ ...prev, min: 'Min Mileage must be a number' }));
            valid = false;
        } else if (parseInt(minMileage.replace(/,/g, '')) < 0) {
            setMileageError((prev) => ({ ...prev, min: 'Min Mileage cannot be less than 0' }));
            valid = false;
        } else if (maxMileage && parseInt(minMileage.replace(/,/g, '')) > parseInt(maxMileage.replace(/,/g, ''))) {
            setMileageError((prev) => ({ ...prev, min: 'Min Mileage cannot be greater than Max Mileage' }));
            valid = false;
        } else if (parseInt(minMileage.replace(/,/g, '')) > 1000000) {
            setMileageError((prev) => ({ ...prev, min: 'Min Mileage cannot exceed 1,000,000' }));
            valid = false;
        } else {
            setMileageError((prev) => ({ ...prev, min: '' }));
        }
    
        // Validate max mileage
        if (maxMileage && isNaN(maxMileage.replace(/,/g, ''))) {
            setMileageError((prev) => ({ ...prev, max: 'Max Mileage must be a number' }));
            valid = false;
        } else if (parseInt(maxMileage.replace(/,/g, '')) > 1000000) {
            setMileageError((prev) => ({ ...prev, max: 'Max Mileage cannot exceed 1,000,000' }));
            valid = false;
        } else {
            setMileageError((prev) => ({ ...prev, max: '' }));
        }
    
        return valid;
    };
    
    
    
    const handleViewDetails = (listing) => {
        setSelectedListing(listing);
        setViewDetailsModal(true);
    };

    const closeModal = () => {
        setViewDetailsModal(false);
        setSelectedListing(null);
    };

    //delete listing function
    const handleDelete = async () => {
        if (!listingToDelete) return;
    
        setIsLoading(true);
        setError('');
    
        try {
            const response = await axios.post(
                'http://localhost:5000/api/listing/delete_listing',
                { id: listingToDelete.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            if (response.data.success) {
                // Filter out the deleted listing from the state
                setListings(listings.filter(listing => listing.id !== listingToDelete.id));
            } else {
                setError('Failed to delete listing. Please try again.');
            }
        } catch (error) {
            setError('Failed to delete listing. Please try again.');
            console.error('Error deleting listing:', error);
        } finally {
            setIsLoading(false);
            setShowDeleteConfirmation(false); // Close confirmation modal
            setListingToDelete(null); // Reset the listing to delete
        }
    };
    

    const handleDeleteClick = (listing) => {
        setListingToDelete(listing);
        setShowDeleteConfirmation(true);
    };

    const handleSearch = () => {
        const priceValid = validatePrices(); 
        const mileageValid = validateMileages(); 

        // Check if there are any validation errors
        if (!priceValid || !mileageValid) {
            // If there are errors, do not close the modal
            return; // Exit the function to keep the modal open
        }
    
        // If there are no validation errors and inputs are empty, close the modal
        if (!minPrice && !maxPrice && !minMileage && !maxMileage) {
            setFilterModalOpen(false); // Close the modal
        } else {
            // Proceed with your search logic here
            console.log('Searching with:', { minPrice, maxPrice, minMileage, maxMileage });
            // You can also close the modal here if you want after successful search
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Car Listings</h1>

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            <div 
                className="flex items-center justify-between bg-white p-4 rounded-md shadow-md cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
            >
                <span className="text-xl text-black font-bold">Filters</span>
                <span className={`transform ${showFilters ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                </span>
            </div>

            {showFilters && (
            <div className="bg-white p-4 rounded-md shadow-md mt-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                <input
                    value={make}
                    onChange={handleInputChange(setMake, () => {}, 'make')}
                    placeholder="Make"
                    className="border p-2 rounded w-full text-black"
                />
                <input
                    value={model}
                    onChange={handleInputChange(setModel, () => {}, 'model')}
                    placeholder="Model"
                    className="border p-2 rounded w-full text-black"
                />
                <input
                    value={year}
                    onChange={handleInputChange(setYear, () => {}, 'year')}
                    placeholder="Year"
                    className="border p-2 rounded w-full text-black"
                />

                <div>
                    <div className="flex space-x-2">
                    <div className="w-full">
                        <input
                        value={minPrice}
                        onChange={handleInputChange(setMinPrice, setPriceError, 'min')}
                        placeholder="Min Price"
                        className={`border p-2 rounded w-full text-black ${priceError.min ? 'border-red-500' : ''}`} // Fixed the template literal
                        />
                        {priceError.min && <p className="text-red-500 text-sm mt-1">{priceError.min}</p>} {/* Display min price error under min input */}
                    </div>
                    <div className="w-full">
                        <input
                        value={maxPrice}
                        onChange={handleInputChange(setMaxPrice, setPriceError, 'max')}
                        placeholder="Max Price"
                        className={`border p-2 rounded w-full text-black ${priceError.max ? 'border-red-500' : ''}`} // Fixed the template literal
                        />
                        {priceError.max && <p className="text-red-500 text-sm mt-1">{priceError.max}</p>} {/* Display max price error under max input */}
                    </div>
                    </div>
                </div>

                <div>
                    <div className="flex space-x-2">
                    <div className="w-full">
                        <input
                        value={minMileage}
                        onChange={handleInputChange(setMinMileage, setMileageError, 'min')}
                        placeholder="Min Mileage"
                        className={`border p-2 rounded w-full text-black ${mileageError.min ? 'border-red-500' : ''}`} // Fixed the template literal
                        />
                        {mileageError.min && <p className="text-red-500 text-sm mt-1">{mileageError.min}</p>} {/* Display min mileage error under min input */}
                    </div>
                    <div className="w-full">
                        <input
                        value={maxMileage}
                        onChange={handleInputChange(setMaxMileage, setMileageError, 'max')}
                        placeholder="Max Mileage"
                        className={`border p-2 rounded w-full text-black ${mileageError.max ? 'border-red-500' : ''}`} // Fixed the template literal
                        />
                        {mileageError.max && <p className="text-red-500 text-sm mt-1">{mileageError.max}</p>} {/* Display max mileage error under max input */}
                    </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                </div>
                </div>
            </div>
            )}


            {/* Listings */}
            {isLoading ? (
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
                </div>
            ) : (
                <div className="grid gap-4 mt-6">
                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <div key={listing.id} className="relative border rounded-lg shadow-lg p-4">
                                <img 
                                    src={listing.image || 'https://dummyimage.com/600x400/000/fff&text=Car'} 
                                    alt={`${listing.make} ${listing.model}`} 
                                    className="w-full h-32 object-cover rounded" 
                                />
                                <h3 className="text-xl font-semibold text-black">{listing.make} {listing.model} ({listing.year})</h3>
                                <p className="text-gray-600">Mileage: {listing.mileage} km</p>
                                <p className="text-gray-600">Transmission: {listing.transmission}</p>
                                <p className="text-gray-600">Fuel Type: {listing.fuel_type}</p>
                                <span className="block text-lg text-gray-600">{listing.price}</span>

                                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                                    <button
                                        onClick={() => handleViewDetails(listing)}
                                        className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                                    >
                                        View Details
                                    </button>

                                    <button
                                        onClick={() => handleDeleteClick(listing)}
                                        className="bg-red-500 text-white py-2 px-4 rounded w-full"
                                    >
                                        Delete
                                    </button>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No listings found.</p>
                    )}
                </div>
            )}


            {/* View Details Modal */}
            {showViewDetails && selectedListing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Car Details</h2>
                        <div className="text-black">
                            <p><strong>Make:</strong> {selectedListing.make}</p>
                            <p><strong>Model:</strong> {selectedListing.model}</p>
                            <p><strong>Year:</strong> {selectedListing.year}</p>
                            <p><strong>Price:</strong> ${selectedListing.price}</p>
                            <p><strong>Mileage:</strong> {selectedListing.mileage} miles</p>
                            <p><strong>Transmission:</strong> {selectedListing.transmission}</p>
                            <p><strong>Fuel Type:</strong> {selectedListing.fuel_type}</p>
                            <p><strong>Description:</strong> {selectedListing.description}</p>
                            {/* Add any other details you want to display */}
                        </div>
                        <div className="mt-4">
                            <button 
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && listingToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white border-2 border-red-600 rounded-lg p-6 max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="text-black">Are you sure that you want to delete {listingToDelete.make} {listingToDelete.model}, {listingToDelete.year}?</p>
                        <div className="mt-4 flex justify-between">
                            <button 
                                className="bg-red-600 text-white px-4 py-2 rounded-md"
                                onClick={handleDelete}
                            >
                                Yes, Delete
                            </button>
                            <button 
                                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                                onClick={() => setShowDeleteConfirmation(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
