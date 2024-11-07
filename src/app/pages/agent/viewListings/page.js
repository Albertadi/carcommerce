"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import axios from 'axios';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { access_token, user } = useContext(AuthContext);
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

    const buildSearchFilters = () => ({
        make,
        model,
        year: year ? parseInt(year) : undefined,
        min_price: minPrice ? parseFloat(minPrice.replace(/,/g, '')) : undefined,
        max_price: maxPrice ? parseFloat(maxPrice.replace(/,/g, '')) : undefined,
        min_mileage: minMileage ? parseInt(minMileage.replace(/,/g, '')) : undefined,
        max_mileage: maxMileage ? parseInt(maxMileage.replace(/,/g, '')) : undefined,
        transmission,
        fuel_type: fuelType,
        is_sold: isSold,
        seller_email: sellerEmail,
        agent_email: agentEmail,
    });


    const fetchListings = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await axios.post(
                'http://localhost:5000/api/listing/search_listing',
                buildSearchFilters(),
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
            setListings(response.data.listing_list);
        } catch (error) {
            setError('Failed to fetch listings. Please try again.');
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (access_token) {
            fetchListings();
        } else {
            setError("You need to log in to view listings.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    const handleInputChange = (setter, errorSetter, field) => (e) => {
        let value = e.target.value;
    
        // Apply numeric restriction only for price and mileage fields
        if (['minPrice', 'maxPrice'].includes(field)) {
            value = value.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points for price
        } else if (['minMileage', 'maxMileage'].includes(field)) {
            value = value.replace(/[^0-9]/g, ''); // Allow only numbers for mileage
        }
    
        // Enforce minimum and maximum constraints for price and mileage
        if (field === 'minPrice' || field === 'maxPrice') {
            if (parseFloat(value) < 0) value = "0";
            else if (parseFloat(value) > 9999999) value = "9999999";
        } else if (field === 'minMileage' || field === 'maxMileage') {
            if (parseInt(value) < 0) value = "0";
            else if (parseInt(value) > 1000000) value = "1000000";
        }
    
        // Format the value with commas if it's for price or mileage
        const formattedValue = value ? (
            (field === 'minPrice' || field === 'maxPrice') 
                ? parseFloat(value).toLocaleString() 
                : parseInt(value).toLocaleString()
        ) : '';
    
        // Set the formatted or raw value in the state for display
        setter(field === 'make' || field === 'model' ? value : formattedValue);
    
        // Clear the error for the specific field
        errorSetter((prev) => ({ ...prev, [field]: '' }));
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
                { headers: { Authorization: `Bearer ${access_token}` } }
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

        if (!priceValid || !mileageValid) return;

        fetchListings();
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

                    {/* Price Filter Section */}
                    <div>
                        <div className="flex space-x-2">
                            <div className="w-full">
                                <input
                                    value={minPrice}
                                    onChange={handleInputChange(setMinPrice, setPriceError, 'minPrice')}
                                    placeholder="Min Price"
                                    className={`border p-2 rounded w-full text-black ${priceError.min ? 'border-red-500' : ''}`}
                                />
                                {priceError.min && <p className="text-red-500 text-sm mt-1">{priceError.min}</p>}
                            </div>
                            <div className="w-full">
                                <input
                                    value={maxPrice}
                                    onChange={handleInputChange(setMaxPrice, setPriceError, 'maxPrice')}
                                    placeholder="Max Price"
                                    className={`border p-2 rounded w-full text-black ${priceError.max ? 'border-red-500' : ''}`}
                                />
                                {priceError.max && <p className="text-red-500 text-sm mt-1">{priceError.max}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Mileage Filter Section */}
                    <div>
                        <div className="flex space-x-2">
                            <div className="w-full">
                                <input
                                    value={minMileage}
                                    onChange={handleInputChange(setMinMileage, setMileageError, 'minMileage')}
                                    placeholder="Min Mileage"
                                    className={`border p-2 rounded w-full text-black ${mileageError.min ? 'border-red-500' : ''}`}
                                />
                                {mileageError.min && <p className="text-red-500 text-sm mt-1">{mileageError.min}</p>}
                            </div>
                            <div className="w-full">
                                <input
                                    value={maxMileage}
                                    onChange={handleInputChange(setMaxMileage, setMileageError, 'maxMileage')}
                                    placeholder="Max Mileage"
                                    className={`border p-2 rounded w-full text-black ${mileageError.max ? 'border-red-500' : ''}`}
                                />
                                {mileageError.max && <p className="text-red-500 text-sm mt-1">{mileageError.max}</p>}
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
                <div className="grid gap-8 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {listings.length > 0 ? (
                    listings.map((listing) => (
                    <div key={listing.id} className="relative border rounded-lg shadow-lg overflow-hidden">
                        <img
                            src={listing.image_url ? `http://localhost:5000/uploads/${listing.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
                            alt={`${listing.make} ${listing.model}`}
                            className="w-full h-48 object-cover"
                        />

                        <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {listing.make} {listing.model} ({listing.year})
                        </h3>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Mileage:</span> {listing.mileage.toLocaleString()} km
                        </p>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Transmission:</span> {listing.transmission}
                        </p>
                        <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Fuel Type:</span> {listing.fuel_type}
                        </p>
                        <p className="text-lg font-semibold text-red-600 mt-2">
                            ${listing.price.toLocaleString()}
                        </p>

                        <div className="flex justify-between mt-4">
                            <button
                            onClick={() => handleViewDetails(listing)}
                            className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                            >
                            View Details
                            </button>
                            <button
                            onClick={() => handleDeleteClick(listing)}
                            className="bg-red-500 text-white py-1 px-3 rounded-lg"
                            >
                            Delete
                            </button>
                        </div>
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
                            <p><strong>Mileage:</strong> {selectedListing.mileage} km</p>
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
