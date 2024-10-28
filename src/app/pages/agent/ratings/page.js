"use client";
import React, { useState } from 'react';

const UserRatingPage = () => {
  // Hardcoded list of used car agents
  const agents = [
    { id: 1, name: 'Agent A' },
    { id: 2, name: 'Agent B' },
    { id: 3, name: 'Agent C' },
  ];

  const [selectedAgent, setSelectedAgent] = useState(null); // Currently selected agent for rating
  const [rating, setRating] = useState(0); // Rating value
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [showModal, setShowModal] = useState(false); // Modal state
  const [ratings, setRatings] = useState([]); // Store submitted ratings

  // Function to handle rating submission
  const submitRating = () => {
    const newRating = {
      agentId: selectedAgent.id,
      rating,
      feedback,
    };

    // Add the new rating to the existing ratings
    setRatings([...ratings, newRating]);
    alert('Rating submitted successfully!'); // Notify the user
    setShowModal(false); // Close modal
    // Reset rating and feedback
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Rate Sellers</h1>
      <div className="grid grid-cols-1 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white shadow-lg rounded-lg p-4">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <button 
              onClick={() => {
                setSelectedAgent(agent);
                setShowModal(true); // Open modal to rate
              }}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Rate this Seller
            </button>
          </div>
        ))}
      </div>

      {/* Modal for rating */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Rate {selectedAgent?.name}</h2>
            <div className="mb-4">
              <label className="block mb-1">Rating:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Feedback:</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="border rounded px-2 py-1 w-full"
                rows="3"
              />
            </div>
            <div className="flex justify-between">
              <button 
                onClick={submitRating}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
              >
                Submit Rating
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display submitted ratings */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Submitted Ratings</h2>
        <ul className="space-y-2">
          {ratings.map((rating, index) => (
            <li key={index} className="p-4 border rounded bg-gray-100">
              <strong>Agent ID: {rating.agentId}</strong> - Rating: {rating.rating} - Feedback: {rating.feedback}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserRatingPage;
