"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../authorization/AuthContext"; // Adjust path as needed
import axios from "axios";

export default function ProfileManagement() {
  const { access_token } = useContext(AuthContext); // Access the token and user data
  const [profiles, setProfiles] = useState([]);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewProfile({ ...newProfile, [name]: val });
  };

  const addProfile = async () => {
    try {
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

      // Assuming the API responds with the created profile
      setProfiles([...profiles, response.data.profile]);
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
    }
  };

  const deleteProfile = (name) => {
    setProfiles(profiles.filter((profile) => profile.name !== name));
  };

  const startEditing = (profile) => {
    setEditingProfile({ ...profile }); // Create a copy to edit
  };

  const saveProfile = async () => {
    try {
      // Prepare the data to send in the request body
      const updatedProfile = {
        name: editingProfile.name,
        description: editingProfile.description,
        has_buy_permission: editingProfile.has_buy_permission,
        has_sell_permission: editingProfile.has_sell_permission,
        has_listing_permission: editingProfile.has_listing_permission,
      };

      // Send a POST request to the update profile API
      const response = await axios.post(
        "http://localhost:5000/api/profiles/update_profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${access_token}`, // Include JWT token for authorization
          },
        }
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving the profile."); // Optional: notify the user
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setEditingProfile({ ...editingProfile, [name]: val });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 text-neon-red">
      <h1 className="text-2xl font-extrabold mb-5 uppercase tracking-widest">
        User Profiles
      </h1>

      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="border px-4 py-2">Profile Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Buy Permission</th>
            <th className="border px-4 py-2">Sell Permission</th>
            <th className="border px-4 py-2">Listing Permission</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(profiles || []).map((profile) => (
            <tr key={profile.name} className="bg-gray-800 text-white">
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.description}</td>
              <td className="border px-4 py-2">
                {profile.has_buy_permission ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2">
                {profile.has_sell_permission ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2">
                {profile.has_listing_permission ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2 flex justify-around">
                <button
                  onClick={() => startEditing(profile)}
                  className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProfile(profile.name)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowModal(true)}
        className="mt-5 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Profile
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">Add New Profile</h2>
            <input
              type="text"
              name="name"
              placeholder="Profile Name"
              value={newProfile.name}
              onChange={handleChange}
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={newProfile.description}
              onChange={handleChange}
              className="mb-2 p-2 border rounded w-full"
            />
            <label className="block">
              <input
                type="checkbox"
                name="has_admin_permission"
                checked={newProfile.has_admin_permission}
                onChange={handleChange}
              />
              Has Admin Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_buy_permission"
                checked={newProfile.has_buy_permission}
                onChange={handleChange}
              />
              Has Buy Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_sell_permission"
                checked={newProfile.has_sell_permission}
                onChange={handleChange}
              />
              Has Sell Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_listing_permission"
                checked={newProfile.has_listing_permission}
                onChange={handleChange}
              />
              Has Listing Permission
            </label>
            <button
              onClick={addProfile}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Profile
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl mb-4">Edit Profile</h2>
            <input
              type="text"
              name="name"
              value={editingProfile.name}
              onChange={handleEditChange}
              className="mb-2 p-2 border rounded w-full"
            />
            <input
              type="text"
              name="description"
              value={editingProfile.description}
              onChange={handleEditChange}
              className="mb-2 p-2 border rounded w-full"
            />
            <label className="block">
              <input
                type="checkbox"
                name="has_admin_permission"
                checked={editingProfile.has_admin_permission}
                onChange={handleEditChange}
              />
              Has Admin Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_buy_permission"
                checked={editingProfile.has_buy_permission}
                onChange={handleEditChange}
              />
              Has Buy Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_sell_permission"
                checked={editingProfile.has_sell_permission}
                onChange={handleEditChange}
              />
              Has Sell Permission
            </label>
            <label className="block">
              <input
                type="checkbox"
                name="has_listing_permission"
                checked={editingProfile.has_listing_permission}
                onChange={handleEditChange}
              />
              Has Listing Permission
            </label>
            <button
              onClick={saveProfile}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Profile
            </button>
            <button
              onClick={() => setEditingProfile(null)}
              className="mt-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
