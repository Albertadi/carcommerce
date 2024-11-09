"use client";

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import { Filter, Calendar, Clock, Fuel, Settings, X } from 'lucide-react';
import axios from 'axios';

export default function ListingsPage() {
    const router = useRouter();
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

    const handleUpdateListing = (listing) => {
        router.push(`../agent/updateListing/${listing.id}`);
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
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">My Listings</h1>
                    
                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded shadow-sm p-4 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    value={make}
                                    onChange={handleInputChange(setMake, () => {}, 'make')}
                                    placeholder="Search by make or model..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-[#f75049] focus:border-[#f75049] text-gray-800"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 gap-2 transition-colors duration-75"
                            >
                                <Filter className="h-5 w-5" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
    
                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={minPrice}
                                            onChange={handleInputChange(setMinPrice, setPriceError, 'minPrice')}
                                            placeholder="Min"
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 ${
                                                priceError.min ? 'border-[#f75049]' : 'border-gray-200'
                                            }`}
                                        />
                                        <input
                                            value={maxPrice}
                                            onChange={handleInputChange(setMaxPrice, setPriceError, 'maxPrice')}
                                            placeholder="Max"
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 ${
                                                priceError.max ? 'border-[#f75049]' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {(priceError.min || priceError.max) && (
                                        <p className="text-[#f75049] text-xs mt-1">
                                            {priceError.min || priceError.max}
                                        </p>
                                    )}
                                </div>
    
                                {/* Mileage Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mileage Range</label>
                                    <div className="flex gap-2">
                                        <input
                                            value={minMileage}
                                            onChange={handleInputChange(setMinMileage, setMileageError, 'minMileage')}
                                            placeholder="Min"
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 ${
                                                mileageError.min ? 'border-[#f75049]' : 'border-gray-200'
                                            }`}
                                        />
                                        <input
                                            value={maxMileage}
                                            onChange={handleInputChange(setMaxMileage, setMileageError, 'maxMileage')}
                                            placeholder="Max"
                                            className={`w-full px-3 py-2 border rounded-lg text-gray-800 ${
                                                mileageError.max ? 'border-[#f75049]' : 'border-gray-200'
                                            }`}
                                        />
                                    </div>
                                    {(mileageError.min || mileageError.max) && (
                                        <p className="text-[#f75049] text-xs mt-1">
                                            {mileageError.min || mileageError.max}
                                        </p>
                                    )}
                                </div>
    
                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        value={year}
                                        onChange={handleInputChange(setYear, () => {}, 'year')}
                                        placeholder="Enter year"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                                    />
                                </div>
    
                                {/* Model */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        value={model}
                                        onChange={handleInputChange(setModel, () => {}, 'model')}
                                        placeholder="Enter model"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800"
                                    />
                                </div>
                            </div>
                        )}
    
                        {showFilters && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={handleSearch}
                                    className="px-6 py-2 bg-[#f75049] text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Search Cars
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    
            {/* Error Message */}
            {error && (
                <div className="max-w-7xl mx-auto px-6 mt-4">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}
    
            {/* Listings Grid */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f75049]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Create Listing */}
                        <div 
                            onClick={() => {
                                router.push('../agent/createListing');
                            }} 
                            className="relative bg-[#f75049]/40 border-4 border-[#f75049] border-dashed rounded shadow-lg 
                                overflow-hidden flex items-center justify-center cursor-pointer group
                                hover:bg-[#f0b537]/40 hover:border-[#f0b537] hover:text-[#f0b537] transition-colors duration-75"
                            style={{ height: 'fit-content', minHeight: '100%' }}
                        >
                            <p className="text-6xl text-[#f75049] font-rajdhaniBold group-hover:text-[#f0b537]"> + </p>
                        </div>

                        {listings.length > 0 ? (
                            listings.map((listing) => (
                                <div key={listing.id} className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-all duration-75">
                                    <div className="relative">
                                        <img
                                            src={listing.image_url ? `http://localhost:5000/uploads/${listing.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
                                            alt={`${listing.make} ${listing.model}`}
                                            className="w-full h-52 object-cover"
                                        />
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={() => handleDeleteClick(listing)}
                                                className="p-2 bg-white/90 rounded hover:bg-red-50 transition-colors duration-75"
                                                title="Delete listing"
                                            >
                                                <X className="h-5 w-5 text-[#f75049]" />
                                            </button>
                                        </div>
                                    </div>
    
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {listing.make} {listing.model}
                                            </h3>
                                            <p className="text-xl font-bold text-[#f75049]">
                                                ${listing.price.toLocaleString()}
                                            </p>
                                        </div>
    
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Year: {listing.year}
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Clock className="h-4 w-4 mr-2" />
                                                Mileage: {listing.mileage.toLocaleString()} km
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Settings className="h-4 w-4 mr-2" />
                                                {listing.transmission}
                                            </div>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <Fuel className="h-4 w-4 mr-2" />
                                                {listing.fuel_type}
                                            </div>
                                        </div>
    
                                        <div className='grid grid-cols-2 gap-2'>
                                            <button
                                                onClick={() => handleViewDetails(listing)}
                                                className="w-full px-4 py-2 bg-[#f75049] text-white rounded hover:bg-[#f0b537] transition-colors duration-75"
                                            >
                                                View Details
                                            </button>

                                            <button
                                                onClick={() => handleUpdateListing(listing)}
                                                className="w-full px-4 py-2 bg-[#2570d4] text-white rounded hover:bg-[#f0b537] transition-colors duration-75"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No listings found</p>
                                <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
    
            {/* View Details Modal */}
            {showViewDetails && selectedListing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded p-6 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Car Details</h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-3 text-gray-700">
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Make:</span> {selectedListing.make}
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Model:</span> {selectedListing.model}
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Year:</span> {selectedListing.year}
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Price:</span> ${selectedListing.price.toLocaleString()}
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Mileage:</span> {selectedListing.mileage.toLocaleString()} km
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Transmission:</span> {selectedListing.transmission}
                            </p>
                            <p className="flex justify-between border-b pb-2">
                                <span className="font-medium">Fuel Type:</span> {selectedListing.fuel_type}
                            </p>
                            <div className="pt-2">
                                <p className="font-medium mb-2">Description:</p>
                                <p className="text-gray-600">{selectedListing.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && listingToDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white rounded p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-12 h bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <X className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this listing?<br />
                                <span className="font-medium">
                                    {listingToDelete.make} {listingToDelete.model}, {listingToDelete.year}
                                </span>
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowDeleteConfirmation(false)}
                                    className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-75 font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDelete}
                                    className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-75 font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
