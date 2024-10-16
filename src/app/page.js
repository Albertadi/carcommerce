"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get('http://localhost:5000/api/users/2');
        setUser(userResponse.data); 

        const messageResponse = await axios.get('http://localhost:5000/api/hello');
        setMessage(messageResponse.data.message);

        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Show loading message while data is being fetched
  if (loading) return 
    <p className='flex item-center justify-center bg-[#0E0E17] font-rajdhaniSemiBold text-[#f75049]'>
      Loading user data...
    </p>;

  // Show error message if there's an error
  if (error) return <p className='flex item-center justify-center'>{error}</p>;

  return (
    <div className="flex items-center justify-center flex-col text-center min-h-screen items-center h-screen bg-[#0E0E17] font-rajdhaniSemiBold">
      <h1 className='text-[#f75049] font-rajdhaniBold text-2xl'>WELCOME TO THE HOME PAGE</h1>
      <hr className='mt-4 border-[#0E0E17]'/>
      <p className='text-[#f75049] text-lg'>This is the main landing page.</p>
      {/* Link to the login page */}
      <Link href="/pages/login">
        <p className='text-[#f75049] text-lg'>Go to LOGINn</p>
      </Link>
      {/* Sample axios fetch from flask */}
      <h1 className='text-[#f75049] text-lg'>{message}</h1>
      <p className='text-[#f75049] text-lg'><strong>Name:</strong> {user.name}</p>
      <p className='text-[#f75049] text-lg'><strong>Date of Birth:</strong> {user.dob}</p>
      <p className='text-[#f75049] text-lg'><strong>User Profile:</strong> {user.user_profile}</p>
      <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
    </div>
  );
}