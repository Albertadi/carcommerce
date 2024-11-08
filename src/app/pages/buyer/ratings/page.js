"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../authorization/AuthContext";

const SellerRatingPage = () => {
  const { access_token } = useContext(AuthContext);

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [ratingsByAgent, setRatingsByAgent] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the agents from the backend API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('/api/reviewRating/<agent_email>'); // Modify with your actual API
        const data = await response.json();
        setAgents(data.agents); // Assuming response returns an array of agents
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  // Fetch agents on component mount or when search term changes
  useEffect(() => {
    if (searchTerm) {
      setAgents((prevAgents) =>
        prevAgents.filter((agent) =>
          agent.first_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  // Handle agent selection and show rating modal
  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setShowModal(true);
    fetchAgentRatings(agent.email); // Fetch ratings when an agent is selected
  };

  // Handle submitting the review
  const handleSubmitRating = async () => {
    const newReview = { review: feedback, timestamp: new Date().toISOString().split('T')[0] };

    // Send the review and rating to the backend API
    try {
      const response = await fetch('/api/create_reviewRating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          rating: rating,
          review: feedback,
          agent_email: selectedAgent.email,
        }),
      });

      const data = await response.json();

      // Update the UI with the new review and the average rating
      if (data.success) {
        setRatingsByAgent((prevRatings) => {
          const updatedRatings = { ...prevRatings };
          updatedRatings[selectedAgent.email] = {
            reviews: [{ review: feedback, rating, timestamp: newReview.timestamp }, ...(updatedRatings[selectedAgent.email]?.reviews || [])],
            avgRating: data.average_rating,
          };
          return updatedRatings;
        });
      } else {
        console.error("Error submitting review:", data.error);
      }

      setRating(0);
      setFeedback('');
      setShowModal(false);
      setShowAllReviewsModal(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  // Handle viewing all reviews for selected agent
  const handleViewAllReviews = (agent) => {
    setSelectedAgent(agent);
    setShowAllReviewsModal(true);
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

      {/* Loading State */}
      {loading && <p>Loading agents...</p>}

      {/* Display agents */}
      <div className="space-y-4">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="font-semibold">Agent Name: {agent.first_name} {agent.last_name}</h2>
              <p className="text-gray-600">{agent.user_profile}</p>
              <p className="text-yellow-500 font-semibold">Average Rating: {ratingsByAgent[agent.email]?.avgRating || '0'} / 5</p>
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
                    onClick={() => setRating(star)}
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

      {/* Modal for viewing all reviews */}
      {showAllReviewsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">All Reviews for {selectedAgent?.first_name} {selectedAgent?.last_name}</h2>
            <div className="space-y-4">
              {ratingsByAgent[selectedAgent?.email]?.reviews?.length > 0 ? (
                ratingsByAgent[selectedAgent?.email].reviews.map((rating, index) => (
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
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRatingPage;
