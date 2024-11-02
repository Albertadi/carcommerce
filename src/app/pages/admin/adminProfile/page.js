"use client"; // Mark as Client Component

import { useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext'; // Adjust path as needed
import Link from 'next/link';

export default function HomePage() {
  const { user, logout } = useContext(AuthContext); // Access user and logout from context

  return (
    <div className="flex items-center justify-center flex-col text-center bg-gray-100 font-rajdhaniSemiBold">
      <h1 className='text-[#f75049] font-rajdhaniBold text-2xl'>WELCOME TO THE HOME PAGE</h1>
      <hr className='mt-4 border-[#f0f0f7]'/>

      {/* Conditionally render user data or a login prompt */}
      {user ? (
        <div>
          <h1 className='text-[#f75049] text-lg'>Hello, {user.first_name}!</h1>
          <p className='text-[#f75049] text-lg'><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p className='text-[#f75049] text-lg'><strong>Date of Birth:</strong> {user.dob}</p>
          <p className='text-[#f75049] text-lg'><strong>User Profile:</strong> {user.user_profile}</p>

          {/* Show LOGOUT button */}
          <button onClick={logout} className='text-[#f75049] text-lg border-solid border-2 border-[#f75049] p-2 mt-4'>
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
