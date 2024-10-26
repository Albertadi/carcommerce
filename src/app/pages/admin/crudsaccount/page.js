"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State to hold users
  const [searchTermFirstName, setSearchTermFirstName] = useState('');
  const [searchTermEmail, setSearchTermEmail] = useState('');
  const [searchTermProfile, setSearchTermProfile] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userProfile, setUserProfile] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // New state for success/info messages

  // Replace with your actual token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyOTkyNjUzMSwianRpIjoiYjhjODVlM2MtYTJiZi00MmJmLWI1MDYtYzdhMDIzMzcyY2YxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIiwiaGFzX2FkbWluX3Blcm1pc3Npb24iOnRydWUsImhhc19idXlfcGVybWlzc2lvbiI6ZmFsc2UsImhhc19zZWxsX3Blcm1pc3Npb24iOmZhbHNlLCJoYXNfbGlzdGluZ19wZXJtaXNzaW9uIjpmYWxzZX0sIm5iZiI6MTcyOTkyNjUzMSwiY3NyZiI6IjEwZDIwYmNjLTY5ZTAtNDcxNS1iNWMyLTU4NzVmNjJjZGQ2ZiIsImV4cCI6MTcyOTkyNzQzMX0.VOXO-ms5O0SOq3QL7x7SgXFIzfXis6Vs3fzE1ytKENI';

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      setMessage('');

      try {
        const response = await axios.post('http://localhost:5000/api/users/search_user', {
          first_name: searchTermFirstName,
          email: searchTermEmail,
          user_profile: searchTermProfile,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUsers(response.data.account_list);
      } catch (error) {
        setError('Failed to fetch users. Please try again.');
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Adding a slight delay to avoid excessive API calls on every keystroke
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 50);

    return () => clearTimeout(delayDebounce);
  }, [searchTermFirstName, searchTermEmail, searchTermProfile, token]);

  const handleSearchFirstName = (e) => {
    setSearchTermFirstName(e.target.value);
  };

  const handleSearchEmail = (e) => {
    setSearchTermEmail(e.target.value);
  };

  const handleSearchProfile = (e) => {
    setSearchTermProfile(e.target.value);
  };

  //suspend section
  const handleSuspend = async () => {
      if (selectedUsers.size === 0) {
          setMessage('Please select users to suspend');
          return;
      }

      setIsLoading(true);
      setError('');
      setMessage('');
      try {
          for (const userId of selectedUsers) {
              await axios.post(
                  `http://localhost:5000/api/users/suspend/${userId}`,
                  {}, // The request body (if needed); an empty object if there's no body
                  {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  }
              );
          }
          setSelectedUsers(new Set());
          fetchUsers();
          setMessage('Selected users have been suspended successfully');
      } catch (error) {
          setError('Failed to suspend users. Please try again.');
          console.error('Error suspending users:', error);
      } finally {
          setIsLoading(false);
      }
  };

 
  // Function to automatically format DOB input as YYYY-MM-DD with added validation
  const formatDob = (value) => {

    // Remove any non-numeric characters
    let sanitizedValue = value.replace(/\D/g, '');

    let year = sanitizedValue.slice(0, 4);
    let month = sanitizedValue.slice(4, 6);
    let day = sanitizedValue.slice(6, 8);

    // Ensure the month is between 01 and 12
    if (month.length === 2) {
      if (parseInt(month) > 12 || parseInt(month) < 1) {
        setMessage('Invalid month. Please enter a month between 01 and 12.');
      }
      else {
        setMessage(''); // Clear message if valid
      }
    }

    // Ensure the day is between 01 and 31
    if (day.length === 2) {
      if (parseInt(day) > 31 || parseInt(day) < 1) {
        setMessage('Invalid day. Please enter a day between 01 and 31.');
      }
      else {
        setMessage(''); // Clear message if valid
      }
    }

    // Adjust day for months with only 30 days
    if (month === '04' || month === '06' || month === '09' || month === '11') {
      if (parseInt(day) > 30) {
        setMessage('Invalid day for the selected month. Please enter a day between 01 and 30.');
      }
      else {
        setMessage(''); // Clear message if valid
      }
    }

    // Adjust for February
    if (month === '02') {
      const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };
      if (parseInt(day) > 29 || (parseInt(day) === 29 && !isLeapYear(year))) {
        setMessage('Invalid day for February. Please enter a valid day (01-28 or 29 for leap years).');
      }
      else {
        setMessage(''); // Clear message if valid
      }
    }

    // Format as YYYY-MM-DD
    if (sanitizedValue.length >= 6) {
      return `${year}-${month}-${day}`;
    } else if (sanitizedValue.length >= 4) {
      return `${year}-${month}`;
    } else {
      return year;
    }
  };

  const handleDobChange = (e) => {
    const { value } = e.target;
    const formattedDob = formatDob(value);
    setDob(formattedDob); // Update the state with the formatted DOB
  };

  const validateDob = (dob) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Adjusted for YYYY-MM-DD
    return regex.test(dob);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //ensure there are "@", " the @ in between words like "email@test", and "."
    return regex.test(email);
  };

  const handleAddUser = async () => {
    // Form validation
    if (!firstname || !lastname || !dob || !email || !password || !userProfile) {
      setMessage('Please fill in all the fields.');
      return;
    }

    if (!validateDob(dob)) {
      setMessage('Invalid date format. Please use YYYY-MM-DD and ensure the date is valid.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      return;
    }

    const newUser = {
      email,
      password,
      dob, // Ensure this is in the format YYYY-MM-DD
      first_name: firstname,
      last_name: lastname,
      user_profile: userProfile,
    };

    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/users/create_user', newUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
      // Clear form
      setFirstName('');
      setLastName('');
      setDob('');
      setEmail('');
      setPassword('');
      setUserProfile('');
      setMessage('User added successfully!');
    } catch (error) {
      setError('Failed to add user. Please try again.');
      console.error('Error adding user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Success/Info message display */}
      {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}

      {/* Add new account section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-4xl text-center font-bold mb-6 text-white">Add new account</h2>
        <div className="flex flex-col space-y-4 items-center">
          <input
            type="text"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          
          <input
            type="text"
            placeholder="YYYY-MM-DD"
            value={dob}
            onChange={handleDobChange}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          />
          <select
            value={userProfile}
            onChange={(e) => setUserProfile(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
            disabled={isLoading}
          >
            <option value="">Select User Profile</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="used car agent">Used Car Agent</option>
          </select>
          <button
            onClick={handleAddUser}
            className={`bg-blue-500 text-white p-2 rounded-md w-full md:w-1/3 ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </div>

      {/* User List section */}
      <h2 className="text-4xl text-center font-bold mb-6 text-white">User List</h2>

      {/* search section */}
      <div className="flex justify-center mb-4 gap-4">
        <div className="w-1/4">
          <input
            type="text"
            placeholder="Search first name"
            value={searchTermFirstName}
            onChange={handleSearchFirstName}
            className="border p-2 rounded w-full focus:outline-none text-black"
          />
        </div>
        <div className="w-1/4">
          <input
            type="text"
            placeholder="Search email"
            value={searchTermEmail}
            onChange={handleSearchEmail}
            className="border p-2 rounded w-full focus:outline-none text-black"
          />
        </div>
        <div className="w-1/4">
          <input
            type="text"
            placeholder="Search profile"
            value={searchTermProfile}
            onChange={handleSearchProfile}
            className="border p-2 rounded w-full focus:outline-none text-black"
          />
        </div>
      </div>


      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-600">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-gray-600 text-red-500" style={{ width: '10%' }}>SUSPEND</th>
                <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>First Name</th>
                <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>Last Name</th>
                <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>DOB</th>
                <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '25%' }}>Email</th>
                <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>User Profile</th>
              </tr>
            </thead>
            <tbody>
              {/* Single row with loading animation */}
              <tr>
                <td colSpan="6" className="py-16 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-600">
            <thead>
            <tr>
              <th className="py-2 px-4 border border-gray-600 text-red-500" style={{ width: '10%' }}>SUSPEND</th>
              <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>First Name</th>
              <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>Last Name</th>
              <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>DOB</th>
              <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '25%' }}>Email</th>
              <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>User Profile</th>
            </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="py-2 px-4 border border-gray-600">
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="bg-red-500 text-white p-2 rounded"
                      disabled={isLoading} // Disables the button when loading
                    >
                  Suspend
                </button>
                    </td>
                    <td className="py-2 px-4 border border-gray-600 text-white">{user.first_name}</td>
                    <td className="py-2 px-4 border border-gray-600 text-white">{user.last_name}</td>
                    <td className="py-2 px-4 border border-gray-600 text-white">{user.dob}</td>
                    <td className="py-2 px-4 border border-gray-600 text-white">{user.email}</td>
                    <td className="py-2 px-4 border border-gray-600 text-white">{user.user_profile}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-2 px-4 border border-gray-600 text-center text-white">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
