"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorization/AuthContext"; // Adjust path as needed
import axios from "axios";

export default function ProfileManagement() {
  const { access_token } = useContext(AuthContext); // Access the token and user data
  const [profiles, setProfiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [rowSelectedProfile, setRowSelectedProfile] = useState(null);
  const [isRowModalOpen, setIsRowModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    has_admin_permission: false,
    has_buy_permission: false,
    has_sell_permission: false,
    has_listing_permission: false,
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUserForSuspension, setSelectedUserForSuspension] = useState(null);
  const [suspendDuration, setSuspendDuration] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendInvalidMessage, setSuspendInvalidMessage] = useState('');

  const [error, setError] = useState('');

  // Fetch profiles from the backend API
  useEffect(() => {
    async function fetchProfiles() {
      try {
        if (searchTerm) {
          const response = await axios.get(
            "http://localhost:5000/api/profiles/view_profile",
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
              params: {
                name: searchTerm,
              },
            }
          );
          setProfiles([response.data.profile]);
        } else {
          const response = await axios.post(
            "http://localhost:5000/api/profiles/search_profile",
            { name: "", description: "" },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          setProfiles(response.data.profile_list);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }

    fetchProfiles();
  }, [searchTerm]);

  const handleShowSuspendModal = (profile) => {
    setSelectedUserForSuspension(profile);
    setShowSuspendModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewProfile({ ...newProfile, [name]: val });
  };


  const toggleProfileDetails = (profile) => {
    setRowSelectedProfile(profile);
    setIsRowModalOpen(true);
  };

  const addProfile = async () => {
    try {
      setIsLoading(true); // Add loading state while creating profile
      
      // Make API call to create the new profile
      const response = await axios.post(
        "http://localhost:5000/api/profiles/create_profile",
        newProfile,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      // Fetch the updated list of profiles after creating new one
      await fetchProfiles();
  
      // Show success message
      setSuccessMessage('Profile created successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
  
      // Reset form and close modal
      setShowModal(false);
      setNewProfile({
        name: "",
        description: "",
        has_admin_permission: false,
        has_buy_permission: false,
        has_sell_permission: false,
        has_listing_permission: false,
      });
  
    } catch (error) {
      console.error("Error adding profile:", error);
      // Show error message to user
      setError('Failed to create profile. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (profile) => {
    setEditingProfile({ ...profile }); // Create a copy to edit
  };

  const saveProfile = async () => {
    try {
      const updatedProfile = {
        name: editingProfile.name,
        description: editingProfile.description,
        has_buy_permission: editingProfile.has_buy_permission,
        has_sell_permission: editingProfile.has_sell_permission,
        has_listing_permission: editingProfile.has_listing_permission,
      };
  
      const response = await axios.post(
        "http://localhost:5000/api/profiles/update_profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      if (response.status === 200) {
        // Update the local state with the updated profile
        setProfiles(profiles.map(profile => 
          profile.name === editingProfile.name ? {
            ...profile,
            ...updatedProfile
          } : profile
        ));
  
        // Show success message
        setSuccessMessage('Profile updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
        
        // Close the edit modal
        setEditingProfile(null);
  
        // Refresh the profiles list
        fetchProfiles();
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.response?.data?.error || "An error occurred while saving the profile.");
    }
  };
  
  // Add fetchProfiles function outside of useEffect
  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      if (searchTerm) {
        const response = await axios.get(
          "http://localhost:5000/api/profiles/view_profile",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            params: {
              name: searchTerm,
            },
          }
        );
        setProfiles(response.data.profile ? [response.data.profile] : []);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/profiles/search_profile",
          { name: "", description: "" },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setProfiles(response.data.profile_list || []);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      setError('Failed to fetch profiles. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update your useEffect to use the fetchProfiles function
  useEffect(() => {
    fetchProfiles();
  }, [searchTerm, access_token]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setEditingProfile({ ...editingProfile, [name]: val });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-900 text-neon-red">
    {/* Add the success message here, right after the opening div */}
    {successMessage && (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 transition-opacity duration-500">
        {successMessage}
      </div>
    )}

    <h1 className="text-2xl font-extrabold mb-5 uppercase tracking-widest text-white">
      User Profiles
    </h1>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded bg-gray-800 text-white placeholder-gray-400 border-gray-600"
      />

{isLoading ? (
  // Loading State Table
  <div className="overflow-x-auto">
    <table className="min-w-full bg-gray-800 border border-gray-600">
      <thead>
        <tr>
          <th className="py-2 px-4 border border-gray-600 text-white">Profile Name</th>
          <th className="py-2 px-4 border border-gray-600 text-white">Description</th>
          <th className="py-2 px-4 border border-gray-600 text-white">Buy Permission</th>
          <th className="py-2 px-4 border border-gray-600 text-white">Sell Permission</th>
          <th className="py-2 px-4 border border-gray-600 text-white">Listing Permission</th>
          <th className="py-2 px-4 border border-gray-600 text-red-500">Suspend</th>
          <th className="py-2 px-4 border border-gray-600 text-green-500">Update</th>
        </tr>
      </thead>
      <tbody>
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
        <th className="py-2 px-4 border border-gray-600 text-white">Profile Name</th>
        <th className="py-2 px-4 border border-gray-600 text-white">Description</th>
        <th className="py-2 px-4 border border-gray-600 text-white">Buy Permission</th>
        <th className="py-2 px-4 border border-gray-600 text-white">Sell Permission</th>
        <th className="py-2 px-4 border border-gray-600 text-white">Listing Permission</th>
        <th className="py-2 px-4 border border-gray-600 text-red-500">Suspend</th>
        <th className="py-2 px-4 border border-gray-600 text-green-500">Update</th>
      </tr>
    </thead>
    <tbody>
    {profiles && profiles.length > 0 ? (
    profiles.map((profile) => (
      <tr 
        key={profile.name} 
        className="hover:bg-gray-700 cursor-pointer"
        onClick={() => toggleProfileDetails(profile)}
      >
        <td className="py-2 px-4 border border-gray-600 text-white">{profile.name}</td>
        <td className="py-2 px-4 border border-gray-600 text-white">{profile.description}</td>
        <td className="py-2 px-4 border border-gray-600 text-white">
          {profile.has_buy_permission ? "✓" : "✕"}
        </td>
        <td className="py-2 px-4 border border-gray-600 text-white">
          {profile.has_sell_permission ? "✓" : "✕"}
        </td>
        <td className="py-2 px-4 border border-gray-600 text-white">
          {profile.has_listing_permission ? "✓" : "✕"}
        </td>
        <td className="py-2 px-2 border border-gray-600" onClick={(e) => e.stopPropagation()}>
          {profile.name !== 'admin' && (
            <button
              onClick={() => handleShowSuspendModal(profile)}
              className="bg-red-500 text-white p-2 text-lg rounded w-full h-10 flex items-center justify-center"
            >
              🚫
            </button>
          )}
        </td>
        <td className="py-2 px-2 border border-gray-600" onClick={(e) => e.stopPropagation()}>
          {profile.name !== 'admin' && (
            <button
              onClick={() => startEditing(profile)}
              className="bg-green-500 text-white p-2 text-lg rounded w-full h-10 flex items-center justify-center"
            >
              ✎
            </button>
          )}
        </td>
      </tr>
  ))
) : (
  <tr>
    <td colSpan="7" className="py-2 px-4 border border-gray-600 text-center text-white">
      No profiles found.
    </td>
  </tr>
)}
    </tbody>
  </table>
</div>
)}
      <button
        onClick={() => setShowModal(true)}
        className="mt-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Profile
      </button>

      {showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-white">Add New Profile</h2>
          
          <div className="space-y-4">
            {/* Profile Name Input */}
            <input
              type="text"
              name="name"
              placeholder="Profile Name"
              value={newProfile.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700/75 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {/* Description Input */}
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newProfile.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700/75 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />

            {/* Permissions */}
            <div className="space-y-3 mt-4">

              <label className="flex items-center space-x-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="has_buy_permission"
                  checked={newProfile.has_buy_permission}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer bg-gray-700"
                />
                <span>Has Buy Permission</span>
              </label>

              <label className="flex items-center space-x-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="has_sell_permission"
                  checked={newProfile.has_sell_permission}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer bg-gray-700"
                />
                <span>Has Sell Permission</span>
              </label>

              <label className="flex items-center space-x-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="has_listing_permission"
                  checked={newProfile.has_listing_permission}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-0 focus:ring-offset-0 cursor-pointer bg-gray-700"
                />
                <span>Has Listing Permission</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={addProfile}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Create Profile
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>
      </div>
    )}

{editingProfile && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="name"
            value={editingProfile.name}
            onChange={handleEditChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            name="description"
            value={editingProfile.description}
            onChange={handleEditChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              name="has_buy_permission"
              checked={editingProfile.has_buy_permission}
              onChange={handleEditChange}
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span>Has Buy Permission</span>
          </label>
          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              name="has_sell_permission"
              checked={editingProfile.has_sell_permission}
              onChange={handleEditChange}
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span>Has Sell Permission</span>
          </label>
          <label className="flex items-center space-x-3 text-white">
            <input
              type="checkbox"
              name="has_listing_permission"
              checked={editingProfile.has_listing_permission}
              onChange={handleEditChange}
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <span>Has Listing Permission</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={saveProfile}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save Profile
        </button>
        <button
          onClick={() => setEditingProfile(null)}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
    {/* Semi-transparent overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>
  </div>
)}
    {/* Suspend Modal */}
{showSuspendModal && selectedUserForSuspension && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-white">
        Suspend {selectedUserForSuspension.name} for how long?
      </h2>
      
      {/* Duration Input */}
      <input
        type="number"
        min="1"
        value={suspendDuration}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value > 0) {
            setSuspendDuration(value);
            setSuspendInvalidMessage('');
          } else {
            setSuspendDuration('');
            setSuspendInvalidMessage('Please fill in the duration.');
            setTimeout(() => {
              setSuspendInvalidMessage('');
            }, 3000);
          }
        }}
        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        placeholder="Enter duration in days"
      />
      
      {/* Reason Input */}
      <input
        type="text"
        value={suspendReason}
        onChange={(e) => setSuspendReason(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        placeholder="Enter suspension reason"
      />
      
      {/* Error Message */}
      {suspendInvalidMessage && (
        <p className="text-red-500 mb-4">{suspendInvalidMessage}</p>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleSuspend}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Confirm
        </button>
        <button
          onClick={() => {
            setShowSuspendModal(false);
            setSelectedUserForSuspension(null);
            setSuspendDuration('');
            setSuspendReason('');
            setSuspendInvalidMessage('');
          }}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
    {/* Semi-transparent overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-50 -z-10"></div>
  </div>
)}

    {/*Profile Details Modal*/}
{isRowModalOpen && rowSelectedProfile && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-gray-700 p-6 rounded-lg w-1/3 text-white">
      <h2 className="text-xl font-bold mb-4">Profile Details</h2>
      <div className="space-y-3">
        <p className="flex justify-between border-b border-gray-600 pb-2">
          <span className="font-medium">Name:</span> 
          <span>{rowSelectedProfile.name}</span>
        </p>
        <p className="flex justify-between border-b border-gray-600 pb-2">
          <span className="font-medium">Description:</span> 
          <span>{rowSelectedProfile.description}</span>
        </p>
        <p className="flex justify-between border-b border-gray-600 pb-2">
          <span className="font-medium">Buy Permission:</span> 
          <span className={rowSelectedProfile.has_buy_permission ? "text-green-500" : "text-red-500"}>
            {rowSelectedProfile.has_buy_permission ? "✓" : "✕"}
          </span>
        </p>
        <p className="flex justify-between border-b border-gray-600 pb-2">
          <span className="font-medium">Sell Permission:</span> 
          <span className={rowSelectedProfile.has_sell_permission ? "text-green-500" : "text-red-500"}>
            {rowSelectedProfile.has_sell_permission ? "✓" : "✕"}
          </span>
        </p>
        <p className="flex justify-between border-b border-gray-600 pb-2">
          <span className="font-medium">Listing Permission:</span> 
          <span className={rowSelectedProfile.has_listing_permission ? "text-green-500" : "text-red-500"}>
            {rowSelectedProfile.has_listing_permission ? "✓" : "✕"}
          </span>
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <button 
          onClick={() => setIsRowModalOpen(false)} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
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
