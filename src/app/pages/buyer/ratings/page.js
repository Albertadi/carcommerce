"use client";
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../authorization/AuthContext";
import { FaStar, FaUserCircle } from "react-icons/fa";

const SellerRatingPage = () => {
  const { access_token } = useContext(AuthContext);

  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAgentReviews, setSelectedAgentReviews] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState({
    rating: 0,
    review: "",
    agent_email: "",
  });

  // Fetch agents from the backend API based on searchTerm
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/search_agent`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            params: {
              first_name: searchTerm,
            },
          }
        );
        setAgents(response.data.account_list); // Assuming 'account_list' contains agents
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setLoading(false);
      }
    };

    fetchAgents();
  }, [searchTerm, access_token]);

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
  };

  // Show the rating form and set agent email
  const handleSubmitNewRating = (agentEmail) => {
    setShowRatingModal(true);
    setNewRating((prev) => ({ ...prev, agent_email: agentEmail }));
  };

  // Submit the new rating
  const handleRatingSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviewRating/create_reviewRating`, // Ensure endpoint matches the Flask route
        newRating,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Rating submitted successfully!");
        setShowRatingModal(false);
        setNewRating({ rating: 0, review: "", agent_email: "" });
        // Optionally refresh the agent's ratings
        handleViewAllRatings(newRating.agent_email);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  // Handle viewing all reviews for selected agent
  const handleViewAllReviews = (agent) => {
    setSelectedAgent(agent);
    setShowAllReviewsModal(true);
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
      <h1 className="text-2xl font-bold mb-6 text-red-400">Review Agents</h1>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by first name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 w-full text-black"
        />
      </div>
      {/* Loading State */}
      {loading && <p>Loading agents...</p>}

      {/* Display agents */}
      <div className="space-y-4">
        {agents.length > 0 ? (
          agents.map((agent) => (
            <div key={agent.email} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="font-semibold">Agent Name: {agent.first_name} {agent.last_name}</h2>
              <p className="text-gray-600">{agent.user_profile}</p>
              <p className="text-yellow-500 font-semibold">Average Rating: {ratingsByAgent[agent.email]?.avgRating || '0'} / 5</p>
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
                value={newRating.review}
                onChange={(e) =>
                  setNewRating({ ...newRating, review: e.target.value })
                }
                className="border rounded px-2 py-1 w-full text-black"
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

      {/* View Rating Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold text-orange-500">
              Ratings for {selectedAgentReviews?.email}
            </h2>

            <h3 className="mt-4 text-lg font-bold text-orange-500">
              Average Rating: {selectedAgentReviews?.averageRating}
            </h3>

            {/* Scrollable container for reviews */}
            <div className="mt-4 max-h-60 overflow-y-auto">
              <ul className="space-y-4">
                {selectedAgentReviews?.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="flex items-center p-4 bg-gray-200 rounded-lg shadow-md w-full"
                  >
                    <FaUserCircle className="text-red-700 text-5xl mr-4" />
                    <div className="flex-1">
                      <p className="text-black font-semibold">
                        {review.reviewerEmail}
                      </p>
                      <p className="text-gray-700">{review.review}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      <FaStar className="text-black text-xl" />
                      <span className="text-red-600 text-lg ml-2">
                        {review.rating} Stars
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setShowAllReviewsModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
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
