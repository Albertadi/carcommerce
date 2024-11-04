"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../authorization/AuthContext";

const SellerRatingPage = () => {
  const { access_token, user } = useContext(AuthContext); // Retrieve access token and user from AuthContext
  const [agents, setAgents] = useState([]); // Store fetched agents
  const [selectedAgent, setSelectedAgent] = useState(null); // Currently selected agent for rating
  const [rating, setRating] = useState(0); // Rating value
  const [feedback, setFeedback] = useState(''); // Feedback text
  const [showModal, setShowModal] = useState(false); // Modal state
  const [ratings, setRatings] = useState([]); // Store submitted ratings
  const [searchTerm, setSearchTerm] = useState(''); // Search term for agent first name

  // Fetch agents on component mount or when search term changes
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/search_agent?first_name=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        setAgents(response.data.account_list); // Populate agents with fetched data
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    if (access_token) {
      fetchAgents();
    }
  }, [access_token, searchTerm]);

  // Function to fetch ratings for the selected agent
  const fetchAgentRatings = async (agentEmail) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviewRating/${agentEmail}`);
      setRatings(response.data.reviews); // Set fetched ratings for the agent
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  // Function to handle agent selection and fetch their ratings
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
    fetchAgentRatings(agent.email); // Fetch ratings when an agent is selected
  };

  // Function to handle review submission
  const submitRating = async () => {
    if (!selectedAgent) {
      alert('Please select an agent.');
      return;
    }

    const newRating = {
      rating,
      review: feedback,
      agent_email: selectedAgent.email,
      reviewer_email: user.email // Assuming you have the reviewer's email from context
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/reviewRating/create_reviewRating',
        newRating,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.data.success) {
        alert('Rating submitted successfully!');
        // Fetch the updated ratings after submission
        fetchAgentRatings(selectedAgent.email);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setShowModal(false); // Close modal
      setRating(0); // Reset rating
      setFeedback(''); // Reset feedback
      setSelectedAgent(null); // Reset selected agent
    }
  };

  // Function to handle star click for rating
  const handleStarClick = (star) => {
    setRating(star);
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

      {/* Display each agent's description and overall rating */}
      <div className="space-y-4">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="font-semibold">Agent Name: {agent.first_name} {agent.last_name}</h2>
              <p className="text-gray-600">{agent.description}</p>
              <p className="text-gray-600">
                Overall Rating: {agent.overallRating || 'No ratings yet'} ({agent.overallRating ? `${agent.overallRating} / 5` : ''})
              </p>
              <button
                onClick={() => handleAgentSelect(agent)} // Use the new select handler
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                Submit New Rating
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
                    className={`cursor-pointer text-2xl ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
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
                onClick={submitRating} // Call the updated submit function
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
        <h2 className="text-xl font-bold mb-4">Ratings for {selectedAgent?.first_name} {selectedAgent?.last_name}</h2>
        <div className="space-y-4">
          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between">
                <div>
                  <p className="font-semibold">Rating: {Array(rating.rating).fill('★').join('')} ({rating.rating} / 5)</p>
                  <p className="text-gray-600">Feedback: {rating.review}</p>
                </div>
                <p className="text-gray-500 text-sm">{rating.timestamp}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No ratings submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerRatingPage;
