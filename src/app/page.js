"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/hello')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Error fetching message from flask:', error)
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      {/* Link to the login page */}
      <Link href="/pages/login">
        <p>Go to login</p>
      </Link>
      {/* Sample axios fetch from flask */}
      <h1>{message}</h1>
    </div>
  );
}