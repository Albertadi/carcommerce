"use client"; // Use the "use client" directive

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State to hold users
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState(''); // State for account type (default to empty string)
  const [selectedUsers, setSelectedUsers] = useState(new Set()); // State for selected users

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleSuspend = async () => {
    for (const userId of selectedUsers) {
      try {
        await axios.post(`http://localhost:5000/api/users/suspend/${userId}`);
        setUsers(users.filter(user => user.id !== userId)); // Remove suspended user from the list
        console.log(`User with ID ${userId} suspended.`);
      } catch (error) {
        console.error('Error suspending user:', error);
      }
    }
    setSelectedUsers(new Set()); // Clear selected users after action
  };

  const handleCheckboxChange = (userId) => {
    const updatedSelectedUsers = new Set(selectedUsers);
    if (updatedSelectedUsers.has(userId)) {
      updatedSelectedUsers.delete(userId); // Unselect user
    } else {
      updatedSelectedUsers.add(userId); // Select user
    }
    setSelectedUsers(updatedSelectedUsers);
  };

  // Add New User
  const handleAddUser = async () => {
    if (!firstname || !lastname || !dob || !email || !password) {
      alert('Please fill in all the fields.');
      return;
    }

    const newUser = {
      name: `${firstname} ${lastname}`,
      dob,
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/users', newUser);
      setUsers([...users, response.data]); // Update user list with new user
      setFirstName('');
      setLastName('');
      setDob('');
      setEmail('');
      setPassword('');
      console.log('User added successfully:', response.data);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-500 p-6">
      {/* Add new account section */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-4xl text-center font-bold mb-6">Add new account</h2>
        <div className="flex flex-col space-y-4 items-center">
          <input
            type="text"
            placeholder="First name"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
          <input
            type="text"
            placeholder="dd/mm/yyyy"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />

          {/* Dropdown for account type with placeholder */}
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-gray-400"
          >
            <option value="" disabled>Select Account Type</option> {/* Placeholder option, set to disabled = they need to choose one of the options*/}
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="usedCarAgent">Used Car Agent</option>
          </select>

          <button
            onClick={handleAddUser}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-700 w-full md:w-1/3"
          >
            Add
          </button>
        </div>
      </div>

     
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
        <div className="flex justify-center items-center space-x-4">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3 focus:outline-none text-black"
          />
           {/* Search and suspend buttons */}
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
          <button
            onClick={handleSuspend}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            Suspend
          </button>
        </div>
      </div>

      {/* User list table */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <table className="min-w-full bg-red-400 border-black rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-center">Select</th>
              <th className="py-3 px-6 text-center">Name</th>
              <th className="py-3 px-6 text-center">Email</th>
              <th className="py-3 px-6 text-center">DOB</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.dob}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-300">
                <td colSpan="5" className="py-3 px-6 text-center text-black">
                  No users found. Please add a new account.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
