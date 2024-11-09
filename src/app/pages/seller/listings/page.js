"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
import { ListingCard } from '../../../components/ListingCard';
import { ReloginModal } from '../../../components/ReloginModal';
import { BarChart2, X, Eye } from 'lucide-react';
import axios from 'axios';

export default function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { access_token, permissions } = useContext(AuthContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
    const [shortlistCounts, setShortlistCounts] = useState({});
    const [viewCounts, setViewCounts] = useState({});
    const [agentEmail, setAgentEmail] = useState('');

    const sellerEmail = permissions?.sub.email || '';

    const fetchViewCount = async (listingId) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/views/get_views',
                { listing_id: listingId },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                }
            );

            if (response.data && response.data.success) {
                // Ensure we're storing the views_count as a number
                const viewCount = parseInt(response.data.views_count) || 0;
                setViewCounts(prev => ({
                    ...prev,
                    [listingId]: viewCount
                }));
            }
        } catch (error) {
            console.error('Error fetching view count:', error);
        }
    };

    const fetchSpecificListingCount = async (listingId) => {
        try {
            const response = await axios.get(
                'http://localhost:5000/api/shortlist/see_num_car_shortlist',
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    params: {
                        listing_id: listingId
                    }
                }
            );

            if (response.data && response.data.success) {
                setShortlistCounts(prev => ({
                    ...prev,
                    [listingId]: response.data.total_shortlists
                }));
            }
        } catch (error) {
            console.error('Error fetching listing count:', error);
        }
    };
    
    const buildSearchFilters = () => {
        const filters = {};
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
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            if (Array.isArray(response.data.listing_list)) {
                setListings(response.data.listing_list);
                
                // Fetch both metrics for each listing
                response.data.listing_list.forEach(listingItem => {
                    fetchSpecificListingCount(listingItem.id);
                    fetchViewCount(listingItem.id);
                });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setShowLoginModal(true);
            } else {
                setError('Failed to fetch listings. Please try again.');
                console.error('Error fetching listings:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };
  
    useEffect(() => {
        if (access_token) {
            fetchListings();
        }
    }, [access_token]);

    const AnalyticsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Listing Analytics</h2>
                    <button 
                        onClick={() => setShowAnalyticsModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                    {listings.map((listingItem) => {
                        const shortlistCount = shortlistCounts[listingItem.id] || 0;
                        const viewCount = viewCounts[listingItem.id] || 0;
                        
                        return (
                            <div key={listingItem.id} className="py-3 border-b last:border-0">
                                <div className="space-y-3">
                                    <p className="font-medium text-gray-800">
                                        {listingItem.make} {listingItem.model} ({listingItem.year})
                                    </p>
                                    
                                    {/* Views Stats */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Eye size={16} className="text-blue-500" />
                                            <span className="text-sm text-gray-600">
                                                {viewCount} views
                                            </span>
                                        </div>
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-blue-500 rounded-full h-2" 
                                                style={{ 
                                                    width: `${Math.min((viewCount / Math.max(...Object.values(viewCounts), 1)) * 100, 100)}%` 
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Shortlist Stats */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <BarChart2 size={16} className="text-red-500" />
                                            <span className="text-sm text-gray-600">
                                                {shortlistCount} shortlists
                                            </span>
                                        </div>
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-red-500 rounded-full h-2" 
                                                style={{ 
                                                    width: `${Math.min((shortlistCount / Math.max(...Object.values(shortlistCounts), 1)) * 100, 100)}%` 
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Conversion Rate */}
                                    {viewCount > 0 && (
                                        <div className="text-sm text-gray-600">
                                            Shortlist Rate: {((shortlistCount / viewCount) * 100).toFixed(1)}%
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Car Listings</h1>
                <button
                    onClick={() => setShowAnalyticsModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <BarChart2 size={20} />
                    <span>View Analytics</span>
                </button>
            </div>

            {showLoginModal && (
                <ReloginModal onClose={() => setShowLoginModal(false)} />
            )}

            {showAnalyticsModal && <AnalyticsModal />}

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
                        listings.map((listingItem) => {
                            const shortlistCount = shortlistCounts[listingItem.id] || 0;
                            const viewCount = viewCounts[listingItem.id] || 0;
                            
                            return (
                                <ListingCard
                                    key={listingItem.id}
                                    imageSrc={listingItem.image_url ? `http://localhost:5000/uploads/${listingItem.image_url}` : 'https://dummyimage.com/600x400/000/fff&text=Car'}
                                    make={listingItem.make}
                                    model={listingItem.model}
                                    year={listingItem.year}
                                    price={listingItem.price}
                                    mileage={listingItem.mileage}
                                    transmission={listingItem.transmission}
                                    fuelType={listingItem.fuel_type}
                                    dashboardType={"seller"}
                                    analyticsBadge={
                                        <div className="ml-2 inline-flex items-center gap-2">
                                            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1">
                                                <Eye size={14} />
                                                {viewCount} views
                                            </span>
                                            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded flex items-center gap-1">
                                                <BarChart2 size={14} />
                                                {shortlistCount} shortlists
                                            </span>
                                        </div>
                                    }
                                />
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No listings found.</p>
                    )}
                </div>
            )}
        </div>
    );
}
