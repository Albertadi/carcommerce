"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import axios from 'axios';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { token, user } = useContext(AuthContext); // Get token and user from AuthContext

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
    const [agentEmail, setAgentEmail] = useState('');

    // Automatically set sellerEmail from AuthContext user data
    const sellerEmail = user?.email || ''; // Fallback to an empty string if user is not set

    // Function to build search filters
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
        if (sellerEmail) filters.seller_email = sellerEmail; // Use the seller email from AuthContext
        if (agentEmail) filters.agent_email = agentEmail;

        return filters;
    };

    // Function to fetch listings from API using POST
    const fetchListings = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post(
                'http://localhost:5000/api/listing/search_listing',
                buildSearchFilters(), // Only include filters with values
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setListings(response.data.listing_list); // Update listings state
        } catch (error) {
            setError('Failed to fetch listings. Please try again.');
            console.error('Error fetching listings:', error);
        } finally {
            setIsLoading(false);
        }
    };
  
    // Fetch listings on component mount
    useEffect(() => {
      fetchListings();
    }, [token]);
  
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Car Listings</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <ListingCard
                                key={listing.id}
                                imageSrc={listing.image || 'https://dummyimage.com/600x400/000/fff&text=Car'}
                                make={listing.make}
                                model={listing.model}
                                year={listing.year}
                                price={listing.price}
                                mileage={listing.mileage}
                                transmission={listing.transmission}
                                fuelType={listing.fuel_type}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No listings found.</p>
                    )}
                </div>
            )}
        </div>
    );
}