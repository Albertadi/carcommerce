"use client"; // Mark as a client component

import { useEffect, useState, useContext } from 'react';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { AuthContext } from '../../authorization/AuthContext';
import { EnvelopeIcon, UserIcon, CakeIcon } from '@heroicons/react/24/outline';

export default function AgentProfile() {
    const { access_token } = useContext(AuthContext); // Access the JWT token from context
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDOB] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // New loading state

    useEffect(() => {
        const fetchUserProfile = async (userEmail) => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/users/view_user?email=${userEmail}`,
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        }
                    }
                );

                const data = response.data;
                if (data.success) {
                    setEmail(data.user.email);
                    setFirstName(data.user.first_name);
                    setLastName(data.user.last_name);
                    setDOB(data.user.dob);
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        // Decode token and extract email
        if (access_token) {
            const decodedToken = jwtDecode(access_token); // Decode the token
            const userEmail = decodedToken.sub.email;
            setEmail(userEmail); // Set email from token payload
            fetchUserProfile(userEmail); // Fetch user profile with email from token
        } else {
            setLoading(false); // Set loading to false if there is no access_token
        }
    }, [access_token]);

    return (
        <div className="p-8 bg-white shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <UserIcon className="h-8 w-8 text-blue-500" />
                <span>Agent Profile</span>
            </h2>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Name</h3>
                            <p className="text-gray-600">{firstName} {lastName}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <EnvelopeIcon className="h-6 w-6 text-gray-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Email</h3>
                            <p className="text-gray-600">{email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <CakeIcon className="h-6 w-6 text-gray-500" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Date of Birth</h3>
                            <p className="text-gray-600">{dob}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
