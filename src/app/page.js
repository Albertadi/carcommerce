"use client"; // Mark as Client Component

import { useContext } from 'react';
import { AuthContext } from './pages/authorization/AuthContext'; // Adjust path as needed
import Link from 'next/link';

export default function HomePage() {
<<<<<<< HEAD
  const { user, logout } = useContext(AuthContext); // Access user and logout from context

  return (
    <div className="flex items-center justify-center flex-col text-center min-h-screen bg-[#f0f0f7] font-rajdhaniSemiBold">
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

          {/* "View My Profile" Link */}
          <Link href="/profile">
            <p className='text-[#f75049] text-lg absolute top-0 right-0 p-4'>View My Profile</p>
          </Link>
        </div>
      ) : (
        <Link href="/pages/login">
          <p className='text-[#f75049] text-lg absolute top-0 right-0 p-4'>LOGIN</p>
        </Link>
      )}
      <p className='absolute bottom-0 left-0 p-4 text-[#f75049]'>THIS PAGE IS UNDER DEVELOPMENT</p>
=======
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data from the API
  useEffect(() => {
    const fetchUser = async () => {
      try {
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
  if (loading) return <p>Loading user data...</p>;

  // Show error message if there's an error
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page.</p>
      {/* Link to the login page */}
      <Link href="/pages/login">
        <p>Go to login</p>
      </Link>

      <Link href="/pages/admin/crudsaccount">
      <p> Go to crudsaccount </p>
      </Link>

      {/* Sample axios fetch from flask */}
      <h1>{message}</h1>
      
>>>>>>> c81babc531235d7ca65ba2428808d05d6ba89943
    </div>
  );
}
