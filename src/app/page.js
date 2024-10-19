"use client"; // Mark as Client Component

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if the user is logged in by checking if a token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Fetch user data from API using the stored token
      const fetchUserData = async () => {
        try {
          const userResponse = await axios.get('http://localhost:5000/api/login', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userResponse.data); 

          const messageResponse = await axios.get('http://localhost:5000/api/hello');
          setMessage(messageResponse.data.message);

          setLoading(false);
        } catch (error) {
          setError('Error fetching user data');
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      // No token means the user is not logged in
      setLoading(false);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Remove token from localStorage
    setUser(null); // Reset user state
    router.push('/'); // Redirect to the homepage (or refresh the page)
  };

  // Fetch user data from the API
  /*
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
  */
  
  /*
  // Show loading message while data is being fetched
  if (loading) return 
    <p className='flex item-center justify-center bg-[#f0f0f7] font-rajdhaniSemiBold text-[#f75049]'>
      Loading user data...
    </p>;

  // Show error message if there's an error
  if (error) {
    return (
      <div className='flex justify-center items-center h-screen bg-[#f0f0f7] font-rajdhaniSemiBold'>
        <div className='w-96 p-6 border-solid border-2 border-[#f75049]'>
          <p className='text-[#f75049]'>{error}</p>
          <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="flex items-center justify-center flex-col text-center min-h-screen items-center h-screen bg-[#f0f0f7] font-rajdhaniSemiBold">
      <h1 className='text-[#f75049] font-rajdhaniBold text-2xl'>WELCOME TO THE HOME PAGE</h1>
      <hr className='mt-4 border-[#f0f0f7]'/>
      <p className='text-[#f75049] text-lg'>This is the main landing page.</p>

      {/* Conditionally show user info if logged in */}
      {user ? (
        <div>
          <h1 className='text-[#f75049] text-lg'>{message}</h1>
          <p className='text-[#f75049] text-lg'><strong>Name:</strong> {user.name}</p>
          <p className='text-[#f75049] text-lg'><strong>Date of Birth:</strong> {user.dob}</p>
          <p className='text-[#f75049] text-lg'><strong>User Profile:</strong> {user.user_profile}</p>

          {/* Show LOGOUT button */}
          <button 
            onClick={handleLogout} 
            className='text-[#f75049] text-lg border-solid border-2 border-[#f75049] p-2 mt-4'>
            LOGOUT
          </button>
        </div>
      ) : (
        <Link href="/pages/login">
          <p className='text-[#f75049] text-lg absolute top-0 right-0 p-4'>LOGIN</p>
        </Link>
      )}
      <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
    </div>
  );
}