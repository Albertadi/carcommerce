"use client";

import { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    has_admin_permission: false,
    has_buy_permission: false,
    has_sell_permission: false,
    has_listing_permission: false,
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to show/hide the modal

  // Fetch profiles from the backend API
  useEffect(() => {
    async function fetchProfiles() {
      try {
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyOTY3MjQ5MSwianRpIjoiYmM2N2ZiNzMtZDhmNi00MWY2LWE1OGEtN2RjZDFhNDMxOGYyIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIiwiaGFzX2FkbWluX3Blcm1pc3Npb24iOnRydWUsImhhc19idXlfcGVybWlzc2lvbiI6ZmFsc2UsImhhc19zZWxsX3Blcm1pc3Npb24iOmZhbHNlLCJoYXNfbGlzdGluZ19wZXJtaXNzaW9uIjpmYWxzZX0sIm5iZiI6MTcyOTY3MjQ5MSwiY3NyZiI6IjZiZWU1ZDk2LWY1N2EtNDZmOS1hZjYxLTdmNjExZmExNDE1OCIsImV4cCI6MTcyOTY3MzM5MX0.DraPJ8OxRGUAMbDierb2033YIfqnA8podyC3bV6P4YU'; // Get JWT from local or session storage
        const response = await axios.get(
          "http://localhost:5000/api/profile/view_profiles",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send JWT in Authorization header
            },
            params: {
              search: searchTerm, // Include the search term as a query parameter
            },
          }
        );

        // Directly set the profiles state with the fetched data
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }

    fetchProfiles(); // Fetch profiles on component mount
  }, [searchTerm]); // Fetch when the search term changes

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewProfile({ ...newProfile, [name]: val });
  };

  const addProfile = () => {
    // Here you can make an API call to save the new profile to the backend
    setProfiles([...profiles, { ...newProfile, id: profiles.length + 1 }]);
    setShowModal(false); // Close the modal after adding
    setNewProfile({
      name: "",
      description: "",
      has_admin_permission: false,
      has_buy_permission: false,
      has_sell_permission: false,
      has_listing_permission: false,
    });
  };

  const deleteProfile = (name) => {
    setProfiles(profiles.filter((profile) => profile.name !== name));
  };

  const startEditing = (profile) => {
    setEditingProfile(profile);
  };

  const saveProfile = () => {
    setProfiles(
      profiles.map((profile) =>
        profile.name === editingProfile.name ? editingProfile : profile
      )
    );
    setEditingProfile(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setEditingProfile({ ...editingProfile, [name]: val });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 text-neon-red">
      {/* Page Header */}
      <h1 className="text-2xl font-extrabold mb-5 uppercase tracking-widest">
        User Profiles
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
        className="mb-4 p-2 border rounded"
      />

      {/* Table for displaying profiles */}
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="border px-4 py-2">Profile Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Admin Permission</th>
            <th className="border px-4 py-2">Buy Permission</th>
            <th className="border px-4 py-2">Sell Permission</th>
            <th className="border px-4 py-2">Listing Permission</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.name} className="bg-gray-800 text-white">
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.description}</td>
              <td className="border px-4 py-2">{profile.has_admin_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_buy_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_sell_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_listing_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2 flex justify-around">
                <button
                  onClick={() => startEditing(profile)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProfile(profile.name)}
                  className="bg-red-500 text-black px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-800 text-white">
            <td className="border px-4 py-2" colSpan="6">
              <strong>Add New Profile</strong>
            </td>
            <td className="border px-4 py-2">
              <button
                onClick={() => setShowModal(true)} // Open the modal on button click
                className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600"
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modal for adding new profile */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Profile</h2>
            <input
              type="text"
              name="name"
              placeholder="Profile Name"
              value={newProfile.name}
              onChange={handleChange}
              className="w-full p-2 mb-4 border"
            />
            <input
              type="text"
              name="description"
              placeholder="Profile Description"
              value={newProfile.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="has_admin_permission"
                checked={newProfile.has_admin_permission}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Admin Permission</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="has_buy_permission"
                checked={newProfile.has_buy_permission}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Buy Permission</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="has_sell_permission"
                checked={newProfile.has_sell_permission}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Sell Permission</label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="has_listing_permission"
                checked={newProfile.has_listing_permission}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Listing Permission</label>
            </div>
            <div className="flex justify-between">
              <button
                onClick={addProfile}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Profile
              </button>
              <button
                onClick={() => setShowModal(false)} // Close modal
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
