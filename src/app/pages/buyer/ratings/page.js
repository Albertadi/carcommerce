"use client";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../authorization/AuthContext";

const SellerRatingPage = () => {
  const { access_token } = useContext(AuthContext);

  // Dummy data for agents
  const dummyAgents = [
    { dob: "2004-02-10", email: "uca@uca.com", first_name: "John", last_name: "Doe", user_profile: "used car agent" },
    { dob: "1985-05-15", email: "bob@bob.com", first_name: "Bob", last_name: "Smith", user_profile: "used car agent" }
  ];

  // Initial dummy ratings data for each agent
  const initialDummyRatings = {
    "uca@uca.com": [
      { review: "Excellent service!", timestamp: "2024-11-01" },
      { review: "Very knowledgeable agent.", timestamp: "2024-10-20" },
    ],
    "bob@bob.com": [
      { review: "Satisfactory experience.", timestamp: "2024-09-15" },
    ]
  };

  const [agents, setAgents] = useState(dummyAgents); // Initialize with dummy agents
  const [selectedAgent, setSelectedAgent] = useState(null); // Currently selected agent for rating
  const [rating, setRating] = useState(0); // Rating value
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [showModal, setShowModal] = useState(false); // Modal for rating submission
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false); // Modal for viewing all reviews
  const [ratingsByAgent, setRatingsByAgent] = useState(initialDummyRatings); // Store ratings by agent email
  const [searchTerm, setSearchTerm] = useState(''); // Search term for agent first name

  // Filter agents based on search term
  useEffect(() => {
    setAgents(
      dummyAgents.filter((agent) =>
        agent.first_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  // Function to handle agent selection for submitting new rating
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
  };

  // Function to handle viewing all reviews of selected agent
  const handleViewAllReviews = (agent) => {
    setSelectedAgent(agent);
    setShowAllReviewsModal(true);
  };

  // Function to handle star click for rating
  const handleStarClick = (star) => {
    setRating(star);
  };

  const handleSubmitRating = () => {
    const newReview = { review: feedback, timestamp: new Date().toISOString().split('T')[0] };
    
    // Update the ratings for the selected agent
    setRatingsByAgent((prevRatings) => {
      const updatedRatings = { ...prevRatings };
      const agentEmail = selectedAgent.email;

      // If the agent already has ratings, add the new one to the list
      if (updatedRatings[agentEmail]) {
        updatedRatings[agentEmail] = [newReview, ...updatedRatings[agentEmail]];
      } else {
        // If this agent doesn't have any ratings yet, create a new entry
        updatedRatings[agentEmail] = [newReview];
      }

      return updatedRatings;
    });

    // Clear input fields and close modal
    setRating(0);
    setFeedback('');
    setShowModal(false);
    setShowAllReviewsModal(true);  // Open the 'view all reviews' modal with updated ratings
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Rate Agents</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by first name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      {/* Display each agent's description, overall rating */}
      <div className="space-y-4">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.email} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="font-semibold">Agent Name: {agent.first_name} {agent.last_name}</h2>
              <p className="text-gray-600">{agent.user_profile}</p>
              <p className="text-yellow-500 font-semibold">Average Rating: {selectedAgent?.email === agent.email ? (ratingsByAgent[agent.email]?.length > 0 ? (ratingsByAgent[agent.email].length / 5).toFixed(1) : '0') : '0'} / 5</p>
              <button
                onClick={() => handleAgentSelect(agent)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Submit New Rating
              </button>
              <button
                onClick={() => handleViewAllReviews(agent)}
                className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
              >
                View All Reviews
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No agents found.</p>
        )}
      </div>

      {/* Modal for submitting new rating */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Rate {selectedAgent?.first_name} {selectedAgent?.last_name}</h2>
            <div className="mb-4">
              <label className="block mb-1">Rating:</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
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
                onClick={handleSubmitRating}
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

      {/* Modal for viewing all reviews */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">All Reviews for {selectedAgent?.first_name} {selectedAgent?.last_name}</h2>
            <div className="space-y-4">
              {ratingsByAgent[selectedAgent?.email]?.length > 0 ? (
                ratingsByAgent[selectedAgent?.email].map((rating, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <p className="text-gray-600">Feedback: {rating.review}</p>
                    <p className="text-gray-500 text-sm">{rating.timestamp}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
            <button
              onClick={() => setShowAllReviewsModal(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerRatingPage;
