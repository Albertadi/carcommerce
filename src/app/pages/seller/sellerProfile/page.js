"use client";

import { useEffect, useState, useContext } from 'react';
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
import { AuthContext } from '../../authorization/AuthContext';
import { EnvelopeIcon, UserIcon, CakeIcon } from '@heroicons/react/24/outline';

export default function SellerProfile() {
    const { access_token } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDOB] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            }
        };

        if (access_token) {
            const decodedToken = jwtDecode(access_token);
            const userEmail = decodedToken.sub.email;
            setEmail(userEmail);
            fetchUserProfile(userEmail);
        } else {
            setLoading(false);
        }
    }, [access_token]);

    return (
        <div className="p-8 bg-white shadow-lg rounded">
            <h2 className="text-3xl font-rajdhaniBold text-[#0e0e17] mb-6 flex items-center space-x-2">
                <UserIcon className="h-8 w-8 text-[#2570d4]" />
                <span>Seller Profile</span>
            </h2>

            {loading ? (
                <p className="text-[#0e0e17] font-rajdhaniBold">Loading...</p>
            ) : error ? (
                <p className="text-[#f75049]">{error}</p>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <UserIcon className="h-6 w-6 text-[#0e0e17]" />
                        <div>
                            <h3 className="text-lg font-rajdhaniBold text-[#0e0e17]">Name</h3>
                            <p className="text-[#0e0e17] font-rajdhaniSemiBold">{firstName} {lastName}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <EnvelopeIcon className="h-6 w-6 text-[#0e0e17]" />
                        <div>
                            <h3 className="text-lg font-rajdhaniBold text-[#0e0e17]">Email</h3>
                            <p className="text-[#0e0e17] font-rajdhaniSemiBold">{email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <CakeIcon className="h-6 w-6 text-[#0e0e17]" />
                        <div>
                            <h3 className="text-lg font-rajdhaniBold text-[#0e0e17]">Date of Birth</h3>
                            <p className="text-[#0e0e17] font-rajdhaniSemiBold">{dob}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}