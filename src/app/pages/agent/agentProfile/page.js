"use client"; // Mark as Client Component

import { useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext'; // Adjust path as needed
import Link from 'next/link';

export default function HomePage() {
  const { access_token, permissions } = useContext(AuthContext); // Access user and logout from context

  return (
    <div className="flex items-center justify-center flex-col text-center bg-gray-100 font-rajdhaniSemiBold">
      <h1 className='text-[#f75049] font-rajdhaniBold text-2xl'>WELCOME TO THE HOME PAGE</h1>
      <hr className='mt-4 border-[#f0f0f7]'/>

      <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
    </div>
  );
}
