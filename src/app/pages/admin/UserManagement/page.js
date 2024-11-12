"use client";

import { useEffect, useState, useContext } from 'react';
import { User, Mail, Lock, Calendar, UserCircle } from 'lucide-react';
import { AuthContext } from '../../authorization/AuthContext';
import { ReloginModal } from '../../../components/ReloginModal';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State to hold users
  const [profiles, setProfiles] = useState([]); // State to hold profiles for dropdown
  const [showLoginModal, setShowLoginModal] = useState(false);
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
  const [showSuspendedInfoModal, setShowSuspendedInfoModal] = useState(false);
  const [suspensionInfo, setSuspensionInfo] = useState(null);

  //for update state
  const [editData, setEditData] = useState({}); // To hold the edited user data


  //for user modal details
  const [rowSelectedUser, setRowSelectedUser] = useState(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);

  //for token
  const {access_token, permissions} = useContext(AuthContext);


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
            Authorization: `Bearer ${access_token}`,
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

  const fetchProfiles = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/profiles/search_profile',
        {}, // Empty object if no filtering criteria are required
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setProfiles(response.data.profile_list); // Update the profiles state with API data
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  // Call fetchUsers initially when the component mounts
  useEffect(() => {
    fetchUsers();
    fetchProfiles();
  }, [access_token]); // Only runs on token change or initial mount

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


  const toggleUserDetails = async (user) => {
    try {
      // Make an API call to fetch user details from the view_user endpoint
      const response = await axios.get("http://localhost:5000/api/users/view_user", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          email: user.email,
        },
      });
  
      // Set the response data to rowSelectedUser
      setRowSelectedUser(response.data.user);
      setIsRowModalOpen(true); // Open the modal to display user details
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  

  // Suspend function with fetchUsers call
  const openSuspendModal = async (user) => {
    setSelectedUser(user);
    try {
      // Check if the user is currently suspended
      const response = await axios.post(
        'http://localhost:5000/api/suspension/check_user',
        { email: user.email },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const data = response.data;
      if (data.success && data.is_suspended) {
        // User is currently suspended, show suspension info modal
        setSuspensionInfo(data.suspension_details);
        setShowSuspendedInfoModal(true);
      } else {
        // User is not suspended, open the suspension creation modal
        setShowSuspendModal(true);
      }
    } catch (error) {
      console.error("Error checking suspension status:", error);
    }
  };

  const closeSuspendModal = () => {
    setShowSuspendModal(false);
    setDuration('');
    setSuspendReason('');
  };

  const closeSuspendedInfoModal = () => {
    setShowSuspendedInfoModal(false);
    setSuspensionInfo(null);
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
        'http://localhost:5000/api/suspension/suspend_user', 
        { email: selectedUser.email, days: duration, reason: suspendReason },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
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
          Authorization: `Bearer ${access_token}`,
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
          Authorization: `Bearer ${access_token}`,
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
    <div className="min-h-screen bg-[#0e0e17] rounded p-6">

      {/* Relogin modal */}
      {showLoginModal && (
        <ReloginModal onClose={() => setShowLoginModal(false)} />
      )}

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
      <div className="h-100 bg-[#0e0e17] p-8 flex items-center rounded justify-center">
      <div className="w-full max-w-xl bg-[#0e0e17] rounded p-8 shadow-2xl">
        <h2 className="text-4xl font-rajdhaniBold text-white text-center mb-8">
          Create New Account
        </h2>
        
        <div className="space-y-6">
          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              value={dob}
              onChange={handleDobChange}
              className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={userProfile}
              onChange={(e) => setUserProfile(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              disabled={isLoading}
            >
              <option value="" className="bg-[#0b0b12] text-white">Select User Profile</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.name} className="bg-[#0b0b12] text-white">
                  {profile.name}
                </option>
              ))}
            </select>
            <style jsx>{`
              select option:checked {
                background: #3b82f6 !important;
                color: white !important;
              }
              select option:hover {
                background: #3b82f6 !important;
                color: white !important;
              }
            `}</style>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAddUser}
            className={`w-full py-3 rounded bg-[#2570d4]/10 text-[#2570d4] font-rajdhaniSemiBold border-2 border-[#2570d4]/30 hover:border-[#2570d4] hover:bg-[#2570d4]/25 focus:border-[#2570d4] focus:bg-[#2570d4]/40 active:bg-[#2570d4]/70 active:border-[#2570d4] transition-all duration-200 active:duration-50 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>

      {/* Search section with updated styling */}
      <h2 className="text-4xl p-8 text-center font-rajdhaniBold mb-6 text-white">User List</h2>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search First Name"
          value={searchTermFirstName}
          onChange={handleSearchFirstName}
          className="p-2 rounded bg-[#0b0b12] text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none mr-2"
        />
        <input
          type="text"
          placeholder="Search Email"
          value={searchTermEmail}
          onChange={handleSearchEmail}
          className="p-2 rounded bg-[#0b0b12] text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none mr-2"
        />
        <input
          type="text"
          placeholder="Search Profile"
          value={searchTermProfile}
          onChange={handleSearchProfile}
          className="p-2 rounded bg-[#0b0b12] text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
        />
      </div>

      {/* Updated table styling */}
      {isLoading ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#231218] border-2 border-[#f75049]">
            <thead>
              <tr>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-red-500" style={{ width: '10%' }}>SUSPEND</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-green-500" style={{ width: '10%' }}>UPDATE</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>First Name</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>Last Name</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>DOB</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '20%' }}>Email</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '20%' }}>User Profile</th>
              </tr>
            </thead>
            <tbody>
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#0b0b12] border-2 border-[#f75049]">
            <thead>
              <tr>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-red-500" style={{ width: '10%' }}>SUSPEND</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-green-500" style={{ width: '10%' }}>UPDATE</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>First Name</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>Last Name</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '15%' }}>DOB</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '20%' }}>Email</th>
                <th className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniBold text-white" style={{ width: '20%' }}>User Profile</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#692728] cursor-pointer" onClick={() => toggleUserDetails(user)}>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">
                      {user.email !== 'admin@admin.com' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openSuspendModal(user); }}
                          className="bg-[#f75049] text-white p-2 w-full text-lg rounded flex items-center justify-center"
                        >
                          🛇
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">
                      {user.email !== 'admin@admin.com' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openUpdateModal(user); }}
                          className="bg-[#1ded83] text-white p-2 w-full text-lg rounded flex items-center justify-center"
                        >
                          ✎
                        </button>
                      )}
                    </td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">{user.first_name}</td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">{user.last_name}</td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">{user.dob}</td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">{user.email}</td>
                    <td className="py-2 px-4 border-2 border-[#f75049] font-rajdhaniSemiBold text-[#e2e2ef]">{user.user_profile}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-2 px-4 border-2 border-[#f75049] text-center font-rajdhaniBold text-[#f75049]">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal with new styling */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#0e0e17] border-2 border-[#f75049] p-8 rounded shadow-xl w-96">
            <h2 className="text-xl font-rajdhaniBold mb-4 text-white">Update {selectedUser.email}</h2>
            
            <div className="mb-4">
              <label className="block text-white mb-1">First Name</label>
              <input
                type="text"
                value={editData.first_name}
                onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-1">Last Name</label>
              <input
                type="text"
                value={editData.last_name}
                onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-1">DOB</label>
              <input
                type="date"
                value={editData.dob}
                onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
                className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-1">User Profile</label>
              <select
                value={editData.user_profile}
                onChange={(e) => setEditData({ ...editData, user_profile: e.target.value })}
                className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                <option value="">Select User Profile</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="used car agent">Used Car Agent</option>
              </select>
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <button
                onClick={handleUpdateConfirm}
                className="px-6 py-2 rounded bg-[#2570d4]/10 text-[#2570d4] font-rajdhaniSemiBold border-2 border-[#2570d4]/30 hover:border-[#2570d4] hover:bg-[#2570d4]/25 focus:border-[#2570d4] focus:bg-[#2570d4]/40 active:bg-[#2570d4]/70 active:border-[#2570d4] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Confirm
              </button>
              <button
                onClick={closeUpdateModal}
                className="px-6 py-2 rounded bg-[#f75049]/10 text-[#f75049] font-rajdhaniSemiBold border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#f75049]/25 focus:border-[#f75049] focus:bg-[#f75049]/40 active:bg-[#f75049]/70 active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>
        </div>
      )}

      {/* Suspend Modal with new styling */}
      {showSuspendModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#0e0e17] border-2 border-[#f75049] p-8 rounded shadow-xl w-96">
            <h2 className="text-xl font-rajdhaniBold mb-4 text-white">Suspend {selectedUser.email} for how long?</h2>

            <input
              type="number"
              min="1"
              value={duration || ""}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                  setDuration(value);
                  setInvalidMessage("");
                } else {
                  setDuration("");
                  setInvalidMessage("Please fill in the duration.");
                  setTimeout(() => {
                    setInvalidMessage('');
                  }, 3000);
                }
              }}
              className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none mb-4"
              placeholder="Enter duration in days"
            />

            <input
              type="text"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full p-3 rounded bg-[#0b0b12] text-lg text-white font-rajdhaniMedium placeholder-gray-400 border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#231218] focus:border-[#f75049] focus:bg-[#692728] active:bg-[#a43836] active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none mb-4"
              placeholder="Enter suspension reason"
            />

            <div className="flex justify-center space-x-3 mt-6">
              <button
                onClick={handleSuspend}
                className="px-6 py-2 rounded bg-[#2570d4]/10 text-[#2570d4] font-rajdhaniSemiBold border-2 border-[#2570d4]/30 hover:border-[#2570d4] hover:bg-[#2570d4]/25 focus:border-[#2570d4] focus:bg-[#2570d4]/40 active:bg-[#2570d4]/70 active:border-[#2570d4] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Confirm
              </button>
              <button
                onClick={closeSuspendModal}
                className="px-6 py-2 rounded bg-[#f75049]/10 text-[#f75049] font-rajdhaniSemiBold border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#f75049]/25 focus:border-[#f75049] focus:bg-[#f75049]/40 active:bg-[#f75049]/70 active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>
        </div>
      )}

      {/* Suspended Info Modal with new styling */}
      {showSuspendedInfoModal && suspensionInfo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#0e0e17] border-2 border-[#f75049] p-8 rounded shadow-xl w-96 text-white">
            <h2 className="text-xl font-rajdhaniBold mb-4">User Already Suspended</h2>
            <div className="space-y-3">
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Email:</span>
                <span className="font-rajdhaniMedium">{selectedUser.email}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Suspended From:</span>
                <span className="font-rajdhaniMedium">{suspensionInfo.start_date}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Suspended Until:</span>
                <span className="font-rajdhaniMedium">{suspensionInfo.end_date}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Reason:</span>
                <span className="font-rajdhaniMedium">{suspensionInfo.reason}</span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeSuspendedInfoModal}
                className="px-6 py-2 rounded bg-[#f75049]/10 text-[#f75049] font-rajdhaniSemiBold border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#f75049]/25 focus:border-[#f75049] focus:bg-[#f75049]/40 active:bg-[#f75049]/70 active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal with new styling */}
      {isRowModalOpen && rowSelectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#0e0e17] border-2 border-[#f75049] p-8 rounded shadow-xl w-96 text-white">
            <h2 className="text-xl font-rajdhaniBold mb-4">User Details</h2>
            <div className="space-y-3">
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">First Name:</span>
                <span className="font-rajdhaniMedium">{rowSelectedUser.first_name}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Last Name:</span>
                <span className="font-rajdhaniMedium">{rowSelectedUser.last_name}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Email:</span>
                <span className="font-rajdhaniMedium">{rowSelectedUser.email}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">Date of Birth:</span>
                <span className="font-rajdhaniMedium">{rowSelectedUser.dob}</span>
              </p>
              <p className="flex justify-between border-b border-[#f75049]/30 pb-2">
                <span className="font-rajdhaniSemiBold">User Profile:</span>
                <span className="font-rajdhaniMedium">{rowSelectedUser.user_profile}</span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsRowModalOpen(false)}
                className="px-6 py-2 rounded bg-[#f75049]/10 text-[#f75049] font-rajdhaniSemiBold border-2 border-[#f75049]/30 hover:border-[#f75049] hover:bg-[#f75049]/25 focus:border-[#f75049] focus:bg-[#f75049]/40 active:bg-[#f75049]/70 active:border-[#f75049] transition-all duration-200 active:duration-50 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}