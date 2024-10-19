"use client";

import { useState } from "react";

const initialProfiles = [
  {
    name: "Admin",
    description: "Administrator with full permissions",
    has_admin_permission: true,
    has_buy_permission: true,
    has_sell_permission: true,
    has_listing_permission: true,
  },
  {
    name: "Buyer",
    description: "User with permission to buy only",
    has_admin_permission: false,
    has_buy_permission: true,
    has_sell_permission: false,
    has_listing_permission: false,
  },
  {
    name: "Seller",
    description: "User with permission to sell",
    has_admin_permission: false,
    has_buy_permission: false,
    has_sell_permission: true,
    has_listing_permission: true,
  },
  {
    name: "Agent",
    description: "Used car agent with buy, sell, and listing permissions",
    has_admin_permission: false,
    has_buy_permission: true,
    has_sell_permission: true,
    has_listing_permission: true,
  },
];

const [profiles, setProfiles] = useState(initialProfiles);
const [newProfile, setNewProfile] = useState({
  name: "",
  description: "",
  has_admin_permission: false,
  has_buy_permission: false,
  has_sell_permission: false,
  has_listing_permission: false,
});
const [editingProfile, setEditingProfile] = useState(null);

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  const val = type === "checkbox" ? checked : value;
  setNewProfile({ ...newProfile, [name]: val });
};

const addProfile = () => {
  setProfiles([...profiles, { ...newProfile, id: profiles.length + 1 }]);
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
export default function profiles() {
  <div>
    <div className="flex flex-col items-center p-8 bg-gray-100 text-neon-red">
      {/* Page Header */}
      <h1 className="text-2xl font-extrabold mb-8 uppercase tracking-widest">
        User Profiles
      </h1>

      {/* Form for adding new profiles */}
      <div className="w-full md:w-1/2 text-center bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-neon-red">
          Add New Profile
        </h2>

        <input
          type="text"
          name="name"
          value={newProfile.name}
          placeholder="Name"
          onChange={handleChange}
          className="w-full bg-gray-700 text-white border border-neon-red-glow rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-neon-red"
        />

        <input
          type="text"
          name="description"
          value={newProfile.description}
          placeholder="Description"
          onChange={handleChange}
          className="w-full bg-gray-700 text-white border border-neon-red-glow rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-neon-red"
        />

        <div className="flex justify-center space-x-4 mb-4">
          <label className="flex items-center text-white">
            <input
              type="checkbox"
              name="has_admin_permission"
              checked={newProfile.has_admin_permission}
              onChange={handleChange}
              className="mr-2"
            />
            Admin Permission
          </label>

          <label className="flex items-center text-white">
            <input
              type="checkbox"
              name="has_buy_permission"
              checked={newProfile.has_buy_permission}
              onChange={handleChange}
              className="mr-2"
            />
            Buy Permission
          </label>

          <label className="flex items-center text-white">
            <input
              type="checkbox"
              name="has_sell_permission"
              checked={newProfile.has_sell_permission}
              onChange={handleChange}
              className="mr-2"
            />
            Sell Permission
          </label>

          <label className="flex items-center text-white">
            <input
              type="checkbox"
              name="has_listing_permission"
              checked={newProfile.has_listing_permission}
              onChange={handleChange}
              className="mr-2"
            />
            Listing Permission
          </label>
        </div>

        <button
          onClick={() => addProfile()}
          className="w-full bg-neon-red-glow text-black py-2 rounded hover:bg-red-600 transition-colors"
        >
          Add Profile
        </button>
      </div>

      {/* Table for displaying profiles */}
      <div className="w-full md:w-4/5 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-neon-red">
          Existing Profiles
        </h2>

        <table className="w-full table-auto border-collapse text-center border border-neon-red-glow shadow-lg">
          <thead className="bg-gray-800 text-white uppercase">
            <tr>
              <th className="px-4 py-2 border-b border-neon-red-glow">Name</th>
              <th className="px-4 py-2 border-b border-neon-red-glow">
                Description
              </th>
              <th className="px-4 py-2 border-b border-neon-red-glow">Admin</th>
              <th className="px-4 py-2 border-b border-neon-red-glow">Buy</th>
              <th className="px-4 py-2 border-b border-neon-red-glow">Sell</th>
              <th className="px-4 py-2 border-b border-neon-red-glow">
                Listing
              </th>
              <th className="px-4 py-2 border-b border-neon-red-glow">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles
              .filter((profile) => profile.name !== "Admin") // Exclude Admin profile
              .map((profile) => (
                <tr key={profile.name} className="text-white">
                  {editingProfile && editingProfile.name === profile.name ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editingProfile.name}
                          onChange={handleEditChange}
                          className="bg-gray-700 text-white border border-neon-red-glow rounded px-2 py-1"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="description"
                          value={editingProfile.description}
                          onChange={handleEditChange}
                          className="bg-gray-700 text-white border border-neon-red-glow rounded px-2 py-1"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="has_admin_permission"
                          checked={editingProfile.has_admin_permission}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="has_buy_permission"
                          checked={editingProfile.has_buy_permission}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="has_sell_permission"
                          checked={editingProfile.has_sell_permission}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name="has_listing_permission"
                          checked={editingProfile.has_listing_permission}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => saveProfile()}
                          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{profile.name}</td>
                      <td>{profile.description}</td>
                      <td>{profile.has_admin_permission ? "Yes" : "No"}</td>
                      <td>{profile.has_buy_permission ? "Yes" : "No"}</td>
                      <td>{profile.has_sell_permission ? "Yes" : "No"}</td>
                      <td>{profile.has_listing_permission ? "Yes" : "No"}</td>
                      <td>
                        <button
                          onClick={() => startEditing(profile)}
                          className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProfile(profile.name)}
                          className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}
