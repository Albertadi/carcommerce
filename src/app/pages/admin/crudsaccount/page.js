"use client";

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../authorization/AuthContext';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // success and invalid messages state
  const [successMessage, setSuccessMessage] = useState('');
  const [invalidMessage, setInvalidMessage] = useState('');

  //for suspend state
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // to hold user info like id and email
  const [duration, setDuration] = useState(''); // to hold the duration input
  const [suspendReason, setSuspendReason] = useState(""); // reason for suspend

  //for update state
  const [editData, setEditData] = useState({}); // To hold the edited user data


  //for user modal details
  const [rowSelectedUser, setRowSelectedUser] = useState(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);

  //for token
  const {token, user} = useContext(AuthContext);


   // Fetch users function

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setInvalidMessage('');

    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/search_user',
        {
          first_name: searchTermFirstName,
          email: searchTermEmail,
          user_profile: searchTermProfile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.account_list);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchUsers initially when the component mounts
  useEffect(() => {
    fetchUsers();
  }, [token]); // Only runs on token change or initial mount

// Debounced search to avoid excessive API calls
  // Debounced search to avoid excessive API calls
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 50);
    return () => clearTimeout(delayDebounce);
  }, [searchTermFirstName, searchTermEmail, searchTermProfile]);


  // Handle functions
  const handleSearchFirstName = (e) => setSearchTermFirstName(e.target.value);
  const handleSearchEmail = (e) => setSearchTermEmail(e.target.value);
  const handleSearchProfile = (e) => setSearchTermProfile(e.target.value);

  // Update modal functions
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setEditData({
      first_name: user.first_name,
      last_name: user.last_name,
      dob: user.dob,
      email: user.email,
      user_profile: user.user_profile,
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setEditData({});
  };


  const toggleUserDetails = (user) => {
      setRowSelectedUser(user);
      setIsRowModalOpen(true);
  };

  // Suspend function with fetchUsers call
  const openSuspendModal = (user) => {
    setSelectedUser(user);
    setShowSuspendModal(true);
  };

  const closeSuspendModal = () => {
    setShowSuspendModal(false);
    setDuration('');
  };

  const handleSuspend = async () => {
    if (!duration) {
      setInvalidMessage('Please enter a valid suspension duration.');
      setTimeout(() => {
        setInvalidMessage(''); // Clear the message after 3 seconds
      }, 3000);
      return;  // Exit the function early
    }

    // Check if reason is provided
    if (!suspendReason) {
      setInvalidMessage('Please fill in the reason.');
      
      // Clear the invalid message after 3 seconds
      setTimeout(() => {
        setInvalidMessage(''); // Clear the message after 3 seconds
      }, 3000);
      return; 
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setInvalidMessage('');

    try {
      await axios.post(
        `http://localhost:5000/api/suspension/suspend_user/${selectedUser.id}`,
        { email: selectedUser.email, duration },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(`User ${selectedUser.email} has been suspended for ${duration} days.`);
      setTimeout(() => {
        setSuccessMessage(''); // Timer to clear success message after 3 seconds
      }, 3000);
      fetchUsers(); // Refresh the user list after suspension
    } 

    catch (error) {
      setError('Failed to suspend the user. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
      console.error('Error suspending user:', error);

    } 

    finally {
      setIsLoading(false);
      setShowSuspendModal(false);
    }
  };

 
  // Handle update confirm with fetchUsers call
  const handleUpdateConfirm = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const formattedData = {
      first_name: editData.first_name.toString(),
      last_name: editData.last_name.toString(),
      dob: new Date(editData.dob).toISOString().split('T')[0],
      email: editData.email.toString(),
      user_profile: editData.user_profile.toString(),
    };

    try {
      await axios.post('http://localhost:5000/api/users/update_user', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchUsers(); // Refresh the user list after update
      closeUpdateModal();

      //successful message after the modal closed
      setSuccessMessage(`User ${editData.email} updated successfully!`);
      setTimeout(() => {
        setSuccessMessage(''); // Timer to clear success message after 3 seconds
      }, 3000);
    } 
    
    catch (error) {
      setError('Failed to update user. Please try again.');
      // Timer to clear success message after 3 seconds
      setTimeout(() => {
        setError('');
      }, 3000);
    } 
    
    finally {
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
        setInvalidMessage('Invalid month. Please enter a month between 01 and 12.');
        setTimeout(() => {
          setInvalidMessage(''); // Clear the message after 3 seconds
        }, 3000);
      }
      else {
        setInvalidMessage(''); // Clear message if valid
      }
    }

    // Ensure the day is between 01 and 31
    if (day.length === 2) {
      if (parseInt(day) > 31 || parseInt(day) < 1) {
        setInvalidMessage('Invalid day. Please enter a day between 01 and 31.');
        setTimeout(() => {
          setInvalidMessage(''); 
        }, 3000);
      }
      else {
        setInvalidMessage(''); 
      }
    }

    // Adjust day for months with only 30 days
    if (month === '04' || month === '06' || month === '09' || month === '11') {
      if (parseInt(day) > 30) {
        setInvalidMessage('Invalid day for the selected month. Please enter a day between 01 and 30.');
        setTimeout(() => {
          setInvalidMessage(''); 
        }, 3000);
      }
      else {
        setInvalidMessage(''); 
      }
    }

    // Adjust for February
    if (month === '02') {
      const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };
      if (parseInt(day) > 29 || (parseInt(day) === 29 && !isLeapYear(year))) {
        setInvalidMessage('Invalid day for February. Please enter a valid day (01-28 or 29 for leap years).');
        setTimeout(() => {
          setInvalidMessage(''); 
        }, 3000);
      }
      else {
        setInvalidMessage(''); 
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

  // Handle adding a user with fetchUsers call
  const handleAddUser = async () => {
    if (!firstname || !lastname || !dob || !email || !password || !userProfile) {
      setInvalidMessage('Please fill in all the fields.');
      setTimeout(() => {
        setInvalidMessage(''); // Clear the message after 3 seconds
      }, 3000);
      return;
    }

    if (!validateDob(dob)) {
      setInvalidMessage('Invalid date format. Please use YYYY-MM-DD and ensure the date is valid.');
      setTimeout(() => {
        setInvalidMessage(''); 
      }, 3000);
      return;
    }

    if (!validateEmail(email)) {
      setInvalidMessage('Please enter a valid email address.');
      setTimeout(() => {
        setInvalidMessage(''); 
      }, 3000);
      return;
    }

    if (password.length < 8) {
      setInvalidMessage('Password must be at least 8 characters long.');
      setTimeout(() => {
        setInvalidMessage(''); 
      }, 3000);
      return;
    }

    const newUser = {
      email,
      password,
      dob,
      first_name: firstname,
      last_name: lastname,
      user_profile: userProfile,
    };

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    setInvalidMessage('');

    try {
      await axios.post('http://localhost:5000/api/users/create_user', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers(); // Refresh the user list after adding a new user
      setFirstName('');
      setLastName('');
      setDob('');
      setEmail('');
      setPassword('');
      setUserProfile('');
      setSuccessMessage('User added successfully!');
      setTimeout(() => {
        setSuccessMessage(''); // Timer to clear success message after 3 seconds
      }, 3000);
    } 
    catch (error) {
      setError('Failed to add user. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
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

      {/* Success message display */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}

        {/* Info message display */}
        {invalidMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {invalidMessage}
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
                  <th className="py-2 px-4 border border-gray-600 text-green-500" style={{ width: '10%' }}>UPDATE</th> 
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>First Name</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>Last Name</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>DOB</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>Email</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>User Profile</th>
                </tr>
              </thead>
              <tbody>
                {/* Single row with loading animation */}
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
            ) : (
              // Loaded table
            <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-600">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-600 text-red-500" style={{ width: '10%' }}>SUSPEND</th>
                  <th className="py-2 px-4 border border-gray-600 text-green-500" style={{ width: '10%' }}>UPDATE</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>First Name</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>Last Name</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '15%' }}>DOB</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>Email</th>
                  <th className="py-2 px-4 border border-gray-600 text-white" style={{ width: '20%' }}>User Profile</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                                                                                    /*hover at any row to see the modal details*/
                    <tr key={user.id} className="hover:bg-gray-700 cursor-pointer" onClick={() => toggleUserDetails(user)}> 
                      
                      <td className="py-2 px-4 border border-gray-600">
                        {user.email !== 'admin@admin.com' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); openSuspendModal(user); }}  
                            className="bg-red-500 text-white p-2 w-full text-lg rounded"
                            disabled={isLoading}
                          >
                            🛇
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-4 border border-gray-600">
                        {user.email !== 'admin@admin.com' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); openUpdateModal(user); }}
                            className="bg-green-500 text-white p-2 w-full text-lg rounded"
                          >
                            ✎
                          </button>
                        )}
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
                    <td colSpan="7" className="py-2 px-4 border border-gray-600 text-center text-white">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>


            {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
              
          </div>
      )}
      
       {/* Suspend Modal */}
       {showSuspendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Suspend {selectedUser.email} for how long?</h2>

            {/* Duration Input */}
            <input
              type="number"
              min="1"
              value={duration || ""}  // Shows an empty field instead of 0 when cleared
              onChange={(e) => {
                const value = Number(e.target.value);
            
                if (value > 0) {  
                  setDuration(value);
                  setInvalidMessage(""); // Clear the invalid message if input is valid
                } else {
                  setDuration(""); // Clear the input if the value is invalid (less than 1)
                  setInvalidMessage("Please fill in the duration.");
                  setTimeout(() => {
                    setInvalidMessage(''); // Clear the message after 3 seconds
                  }, 3000);
                }
              }}
              className="border p-2 w-full mb-4 text-black"
              placeholder="Enter duration in days"
            />

            {/* Reason Input */}
            <input
              type="text"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="border p-2 w-full mb-4 text-black"
              placeholder="Enter suspension reason"
            />
            {!suspendReason && <p className="text-red-500">{invalidMessage}</p>} {/* Display invalid message for reason */}

            <div className="flex justify-end">
              <button
                onClick={handleSuspend}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Confirm
              </button>
              <button
                onClick={closeSuspendModal}
                className="bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-700 p-6 rounded-lg w-1/3">
          <h2 className="text-xl font-bold mb-4">Update {selectedUser.email}</h2>
          
          <div className="mb-4">
            <label className="block text-white mb-1">First Name</label>
            <input
              type="text"
              value={editData.first_name}
              onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1">Last Name</label>
            <input
              type="text"
              value={editData.last_name}
              onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1">DOB</label>
            <input
              type="date"
              value={editData.dob}
              onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-1">User Profile</label>
            <select
              value={editData.user_profile}
              onChange={(e) => setEditData({ ...editData, user_profile: e.target.value })}
              className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            >
              <option value="">Select User Profile</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="used car agent">Used Car Agent</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={handleUpdateConfirm} className="bg-green-500 text-white p-2 rounded">
              Confirm
            </button>
            <button onClick={closeUpdateModal} className="bg-red-500 text-white p-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/*User Details Modal*/}
    {isRowModalOpen && rowSelectedUser && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-700 p-6 rounded-lg w-1/3 text-white">
          <h2 className="text-xl font-bold mb-4">User Details</h2>
          <p>First Name: {rowSelectedUser.first_name}</p>
          <p>Last Name: {rowSelectedUser.last_name}</p>
          <p>Email: {rowSelectedUser.email}</p>
          <p>DOB: {rowSelectedUser.dob}</p>
          <p>User Profile: {rowSelectedUser.user_profile}</p>
          {/* Other user details */}
          <button onClick={() => setIsRowModalOpen(false)} className="bg-red-500 text-white p-2 rounded mt-4">
            Close
          </button>
        </div>
      </div>
    )}

    </div>
  );
}
