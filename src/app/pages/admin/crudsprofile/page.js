"use client";  // Add this line to make it a Client Component

import React, { useState } from 'react';

// Dummy data for initial user profiles
const initialProfiles = [
  { id: 1, name: "John", password: "Doe", dob: "2000-10-30", user_profile: "Buyer" },
  { id: 2, name: "Jane", password: "Smith", dob: "1995-07-15", user_profile: "Seller" }
];

const UserProfile = () => {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [newProfile, setNewProfile] = useState({ name: "", password: "", dob: "", user_profile: "Buyer" });
  const [editingProfile, setEditingProfile] = useState(null);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProfile({ ...newProfile, [name]: value });
  };

  // Add a new profile
  const addProfile = () => {
    setProfiles([...profiles, { ...newProfile, id: profiles.length + 1 }]);
    setNewProfile({ name: "", password: "", dob: "", user_profile: "Buyer" });
  };

  // Delete a profile
  const deleteProfile = (id) => {
    setProfiles(profiles.filter(profile => profile.id !== id));
  };

  // Edit a profile
  const startEditing = (profile) => {
    setEditingProfile(profile);
  };

  // Save edited profile
  const saveProfile = () => {
    setProfiles(profiles.map(profile => profile.id === editingProfile.id ? editingProfile : profile));
    setEditingProfile(null);
  };

  // Handle editing form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingProfile({ ...editingProfile, [name]: value });
  };

  return (
    <div>
      <h1>User Profiles</h1>

      <br></br>
      <br></br>

      {/* Form for adding new profiles */}
      <div>
        <h2>Add New Profile</h2>

        <br></br>

        <input
          type="text"
          name="name"
          value={newProfile.name}
          placeholder="Name"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          value={newProfile.password}
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="date"
          name="dob"
          value={newProfile.dob}
          placeholder="Date of Birth"
          onChange={handleChange}
        />
        <select
          name="user_profile"
          value={newProfile.user_profile}
          onChange={handleChange}
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
        </select>
        <button onClick={addProfile}>Add Profile</button>
      </div>

      <br></br>
      <br></br>

      {/* Display profiles */}
      <div>
        <h2>Existing Profiles</h2>

        <br></br>
        
        {profiles.map(profile => (
          <div key={profile.id}>
            {editingProfile && editingProfile.id === profile.id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editingProfile.name}
                  onChange={handleEditChange}
                />
                <input
                  type="password"
                  name="password"
                  value={editingProfile.password}
                  onChange={handleEditChange}
                />
                <input
                  type="date"
                  name="dob"
                  value={editingProfile.dob}
                  onChange={handleEditChange}
                />
                <select
                  name="user_profile"
                  value={editingProfile.user_profile}
                  onChange={handleEditChange}
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                </select>
                <button onClick={saveProfile}>Save</button>
              </div>
            ) : (
              <div>
                <p>Name: {profile.name}</p>
                <p>Password: {profile.password}</p>
                <p>Date of Birth: {profile.dob}</p>
                <p>Profile: {profile.user_profile}</p>
                <button onClick={() => startEditing(profile)}>Edit</button>
                <button onClick={() => deleteProfile(profile.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
