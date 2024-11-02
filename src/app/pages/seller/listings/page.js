"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import { ReloginModal } from '../../../components/ReloginModal';
import axios from 'axios';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { access_token, permissions } = useContext(AuthContext); // Get token and user from AuthContext

    // Modal state for 401 Unauthorized error
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Search filter state
    const [agentEmail, setAgentEmail] = useState('');

    // Automatically set sellerEmail from AuthContext user data
    const sellerEmail = permissions?.sub.email || ''; // Fallback to an empty string if user is not set

    // Function to build search filters
    const buildSearchFilters = () => {
        const filters = {};

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
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            setListings(response.data.listing_list); // Update listings state
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setShowLoginModal(true); // Show login modal if 401 error occurs
            } else {
                setError('Failed to fetch listings. Please try again.');
                console.error('Error fetching listings:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };
  
    // Fetch listings on component mount
    useEffect(() => {
      fetchListings();
    }, [access_token]);
  
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Car Listings</h1>

            {/* Redirect User to Login if token expires */}
            {showLoginModal && (
                <ReloginModal onClose={() => setShowLoginModal(false)} />
            )}

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
