"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Profiles() {
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
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczMDA1MTIyNiwianRpIjoiZTUyZWNjZGUtZmMzZi00NGIyLTkzYmQtNzFjNzIxNGMzYmI4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIiwiaGFzX2FkbWluX3Blcm1pc3Npb24iOnRydWUsImhhc19idXlfcGVybWlzc2lvbiI6ZmFsc2UsImhhc19zZWxsX3Blcm1pc3Npb24iOmZhbHNlLCJoYXNfbGlzdGluZ19wZXJtaXNzaW9uIjpmYWxzZX0sIm5iZiI6MTczMDA1MTIyNiwiY3NyZiI6IjJiOWEwNTMwLTA3MjYtNGVjMi1iYTQ5LWEyOGFkYThiYTE2NCIsImV4cCI6MTczMDA1MjEyNn0.CDyQkzYty2QUsnqizG2OWLieX3LZDVZxE7P5d62digE";

        if (searchTerm) {
          const response = await axios.get(
            "http://localhost:5000/api/profiles/view_profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProfiles(response.data.profile_list);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    }

<<<<<<< HEAD
    fetchProfiles();
  }, [searchTerm]);
=======
    fetchProfiles(); // Fetch profiles on component mount
  }, [searchTerm]); // Fetch when the search term changes
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setNewProfile({ ...newProfile, [name]: val });
  };

<<<<<<< HEAD
  const addProfile = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczMDA1MTIyNiwianRpIjoiZTUyZWNjZGUtZmMzZi00NGIyLTkzYmQtNzFjNzIxNGMzYmI4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIiwiaGFzX2FkbWluX3Blcm1pc3Npb24iOnRydWUsImhhc19idXlfcGVybWlzc2lvbiI6ZmFsc2UsImhhc19zZWxsX3Blcm1pc3Npb24iOmZhbHNlLCJoYXNfbGlzdGluZ19wZXJtaXNzaW9uIjpmYWxzZX0sIm5iZiI6MTczMDA1MTIyNiwiY3NyZiI6IjJiOWEwNTMwLTA3MjYtNGVjMi1iYTQ5LWEyOGFkYThiYTE2NCIsImV4cCI6MTczMDA1MjEyNn0.CDyQkzYty2QUsnqizG2OWLieX3LZDVZxE7P5d62digE";

      // Make API call to create the new profile
      const response = await axios.post(
        "http://localhost:5000/api/profiles/create_profile",
        newProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
=======
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
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
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
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczMDA1MTIyNiwianRpIjoiZTUyZWNjZGUtZmMzZi00NGIyLTkzYmQtNzFjNzIxNGMzYmI4IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInVzZXJfcHJvZmlsZSI6ImFkbWluIiwiaGFzX2FkbWluX3Blcm1pc3Npb24iOnRydWUsImhhc19idXlfcGVybWlzc2lvbiI6ZmFsc2UsImhhc19zZWxsX3Blcm1pc3Npb24iOmZhbHNlLCJoYXNfbGlzdGluZ19wZXJtaXNzaW9uIjpmYWxzZX0sIm5iZiI6MTczMDA1MTIyNiwiY3NyZiI6IjJiOWEwNTMwLTA3MjYtNGVjMi1iYTQ5LWEyOGFkYThiYTE2NCIsImV4cCI6MTczMDA1MjEyNn0.CDyQkzYty2QUsnqizG2OWLieX3LZDVZxE7P5d62digE";
      // Send a POST request to the update profile API
      const response = await axios.post(
        "http://localhost:5000/api/profiles/update_profile",
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token for authorization
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

  const EditProfile = () => {};

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 text-neon-red">
<<<<<<< HEAD
=======
      {/* Page Header */}
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
      <h1 className="text-2xl font-extrabold mb-5 uppercase tracking-widest">
        User Profiles
      </h1>

<<<<<<< HEAD
=======
      {/* Search Bar */}
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
      <input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
<<<<<<< HEAD
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

=======
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
        className="mb-4 p-2 border rounded"
      />

      {/* Table for displaying profiles */}
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="border px-4 py-2">Profile Name</th>
            <th className="border px-4 py-2">Description</th>
<<<<<<< HEAD
=======
            <th className="border px-4 py-2">Admin Permission</th>
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
            <th className="border px-4 py-2">Buy Permission</th>
            <th className="border px-4 py-2">Sell Permission</th>
            <th className="border px-4 py-2">Listing Permission</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
<<<<<<< HEAD
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
=======
          {profiles.map((profile) => (
            <tr key={profile.name} className="bg-gray-800 text-white">
              <td className="border px-4 py-2">{profile.name}</td>
              <td className="border px-4 py-2">{profile.description}</td>
              <td className="border px-4 py-2">{profile.has_admin_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_buy_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_sell_permission ? 'Yes' : 'No'}</td>
              <td className="border px-4 py-2">{profile.has_listing_permission ? 'Yes' : 'No'}</td>
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
            <input
              type="text"
              name="name"
              placeholder="Profile Name"
              value={newProfile.name}
              onChange={handleChange}
<<<<<<< HEAD
              className="mb-2 p-2 border rounded w-full"
=======
              className="w-full p-2 mb-4 border"
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
            />
            <input
              type="text"
              name="description"
<<<<<<< HEAD
              placeholder="Description"
              value={newProfile.description}
              onChange={handleChange}
              className="mb-2 p-2 border rounded w-full"
            />
            <label className="block">
=======
              placeholder="Profile Description"
              value={newProfile.description}
              onChange={handleChange}
              className="w-full p-2 mb-4 border"
            />
            <div className="flex items-center mb-4">
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
              <input
                type="checkbox"
                name="has_admin_permission"
                checked={newProfile.has_admin_permission}
                onChange={handleChange}
<<<<<<< HEAD
              />
              Has Admin Permission
            </label>
            <label className="block">
=======
                className="mr-2"
              />
              <label>Admin Permission</label>
            </div>
            <div className="flex items-center mb-4">
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
              <input
                type="checkbox"
                name="has_buy_permission"
                checked={newProfile.has_buy_permission}
                onChange={handleChange}
<<<<<<< HEAD
              />
              Has Buy Permission
            </label>
            <label className="block">
=======
                className="mr-2"
              />
              <label>Buy Permission</label>
            </div>
            <div className="flex items-center mb-4">
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
              <input
                type="checkbox"
                name="has_sell_permission"
                checked={newProfile.has_sell_permission}
                onChange={handleChange}
<<<<<<< HEAD
              />
              Has Sell Permission
            </label>
            <label className="block">
=======
                className="mr-2"
              />
              <label>Sell Permission</label>
            </div>
            <div className="flex items-center mb-4">
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
              <input
                type="checkbox"
                name="has_listing_permission"
                checked={newProfile.has_listing_permission}
                onChange={handleChange}
<<<<<<< HEAD
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
=======
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
>>>>>>> 28298fd1ce7d940bdfa1b1eb3ece8e52d1edbdd8
          </div>
        </div>
      )}
    </div>
  );
}
