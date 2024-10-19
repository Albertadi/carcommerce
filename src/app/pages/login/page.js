"use client"; // Mark this component as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import axios from 'axios';

export default function AdminPage() {
  const [email, setEmail] = useState('');       // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [error, setError] = useState('');       // State for error messages
  const router = useRouter();                   // Hook for routing

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send POST request to login endpoint
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      const { access_token } = response.data; // Extract access token from response

      // Store the access token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
      }

      // Redirect to home page after successful login
      router.push('/'); 
    } catch (error) {
      // Set error message if login fails
      setError('Invalid email or password');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-[#f0f0f7] font-rajdhaniSemiBold'>
      <div className='w-96 p-6 border-solid border-4 border-[#f75049]'>
        <h1 className='text-[#f75049] text-2xl'>LOGIN</h1>
        <form onSubmit={handleLogin}>
          <div className='mt-4'>
            <div className='flex justify-between items-center mb-4'>
              <label htmlFor="email" className='text-[#f75049] mr-4'>EMAIL </label>
              <input
                type="email"
                id="email"
                placeholder="enter email"
                className='border px-2 py-1 focus:outline-none focus:ring-0 bg-[#f75049] placeholder-[#f0f0f7] text-[#f0f0f7] border-[#f75049] w-2/3 autofill:bg-[#5EF6FF] autofill:text-[#f0f0f7]'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required // Make this field required
              />
            </div>
            <div className='flex justify-between items-center mb-4'>
              <label htmlFor="password" className='text-[#f75049] mr-4'>PASSWORD </label>
              <input
                type="password"
                id="password"
                placeholder="enter password"
                className='border px-2 py-1 focus:outline-none focus:ring-0 bg-[#f75049] placeholder-[#f0f0f7] text-[#f0f0f7] border-[#f75049] w-2/3'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required // Make this field required
              />
            </div>
            <button type="submit" className='bg-[#f75049]/60 text-[#f75049] py-1 px-2 hover:bg-[#f75049] hover:text-[#f0f0f7] border-solid border-2 border-[#f75049]'>Login</button>
          </div>
        </form>
        {error && <p className='text-red-500 mt-4'>{error}</p>}
        <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
      </div>
    </div>
  );
}
