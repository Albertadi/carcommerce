"use client";  // Add this to use client-side features like useState


import { useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {

  const App = () => {
    const [firstname, setFirstName] = useState(''); 
    const [lastname, setLastName] = useState(''); 
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();

      // handle login logic here, example API call
      console.log('Email:', email);
      console.log('Password:', password);
    };

    return (
      <div className="flex justify-center items-center h-screen bg-black relative">
        <div className="bg-white p-6 rounded-lg shadow-lg">
         
            <h1 className="text-6xl text-black font-bold mb-4 text-center">Sign up</h1>
            
            <form onSubmit={handleLogin}>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input 
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 rounded placeholder-black text-black bg-white focus:bg-white focus:text-black"
                required
                />

                <input 
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 rounded placeholder-black text-black bg-white focus:bg-white focus:text-black"
                required
                />

                <input 
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)} 
                className="border p-2 rounded md:col-span-2 placeholder-black text-black bg-white focus:bg-white focus:text-black"
                required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  className="border p-2 rounded md:col-span-2 placeholder-black text-black bg-white focus:bg-white focus:text-black"
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 rounded md:col-span-2 placeholder-black text-black bg-white focus:bg-white focus:text-black"
                  required
                />

                <button type="submit" className="bg-red-500 text-white  p-2 rounded hover:bg-red-700 md:col-span-2">Create Account</button>

              </div>
          </form>
        </div>

        <Link href="/" className="absolute top-4 right-4 text-white" >Go back to homepage</Link>

      </div>
    );
  };

  return <App />;
}
