"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Modal component for displaying car details
const CarDetailsModal = ({ car, onClose }) => {
    if (!car) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold">{car.name}</h2>
                <p>{car.details}</p>
                <img src={car.imageUrl} alt={car.name} className="w-full h-48 object-cover mb-4" />
                <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};

// Main Listings component
const Listings = () => {
    const [cars, setCars] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        fetchCars();
    }, []);

    // Fetch car listings from the API
    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/listing/view_listing');
            setCars(response.data);
        } catch (error) {
            setError("Error fetching car listings");
            console.error("Error fetching car listings:", error);
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    // Delete a car listing
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/listing/delete_listing/${id}`);
            fetchCars(); // Refresh the listings
        } catch (error) {
            console.error("Error deleting car listing:", error);
        }
    };

    // Fetch details for a specific car listing
    const fetchCarDetails = async (id) => {
        try {
            const response = await axios.get(`/api/listing/view_listing?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSelectedCar(response.data);
        } catch (error) {
            console.error("Error fetching car details:", error);
        }
    };

    // Open modal to view car details
    const openModal = async (id) => {
        await fetchCarDetails(id);
    };

    // Close modal
    const closeModal = () => {
        setSelectedCar(null);
    };

    if (loading) return <div>Loading...</div>; // Loading state
    if (error) return <div>{error}</div>; // Error state

    return (
        <div className="container mx-auto p-4">
            <input
                type="text"
                placeholder="Search cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mb-4 w-full text-center"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cars.filter(car => car.name.toLowerCase().includes(searchQuery.toLowerCase())).map(car => (
                    <div key={car.id} className="border rounded-lg p-4 shadow-lg flex flex-col items-center">
                        <img src={car.imageUrl} alt={car.name} className="w-full h-32 object-cover mb-2" />
                        <h3 className="text-lg font-semibold">{car.name}</h3>
                        <p className="text-gray-700">{car.details}</p>
                        <button className="text-blue-500 mt-2" onClick={() => openModal(car.id)}>
                            View Details
                        </button>
                        <div className="flex mt-4">
                            <button className="text-green-500 mr-2">
                                {/* Edit icon (Add SVG here if needed) */}
                                <i class="fas fa-check-circle text-green-500 h-8 w-8"></i>

                            </button>
                            <button className="text-red-500" onClick={() => handleDelete(car.id)}>
                                {/* Trash icon (Add SVG here if needed) */}
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for viewing car details */}
            {selectedCar && (
                <CarDetailsModal car={selectedCar} onClose={closeModal} />
            )}
        </div>
    );
};

export default Listings;
