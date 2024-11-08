"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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

  // Fetch reviews and average rating for a specific agent
  const handleViewAllRatings = async (agentEmail) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviewRating/${agentEmail}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      setSelectedAgentReviews({
        email: agentEmail,
        reviews: response.data.average_rating || [],
        averageRating: response.data.reviews || "No rating available",
      });
      setShowReviewModal(true); // Show the review modal
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
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

  // Handle star click to set rating
  const handleStarClick = (index) => {
    setNewRating((prev) => ({ ...prev, rating: index + 1 }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-red-400">Search Agents</h1>
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
      {loading ? (
        <p>Loading agents...</p>
      ) : (
        <div className="space-y-4">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <div className="flex items-center">
                  <FaUserCircle className="text-red-700 text-5xl mr-4" />
                  <div className="flex-1">
                    <p className="text-black font-semibold">
                      {agent.first_name} {agent.last_name}
                    </p>
                  </div>
                </div>

                {/* View All Ratings Button */}
                <button
                  onClick={() => handleViewAllRatings(agent.email)}
                  className="mt-2 mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  View All Ratings
                </button>

                {/* Submit a New Rating Button */}
                <button
                  onClick={() => handleSubmitNewRating(agent.email)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Submit a New Rating
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No agents found.</p>
          )}
        </div>
      )}
      {/* Submit Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-xl font-semibold text-orange-500">
              Submit a New Rating
            </h2>

            {/* Star Rating */}
            <div className="mt-4 flex justify-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => handleStarClick(index)}
                  className={`cursor-pointer text-3xl ${
                    index < newRating.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review Textarea */}
            <div className="mt-4">
              <label className="block font-medium">Review:</label>
              <textarea
                value={newRating.review}
                onChange={(e) =>
                  setNewRating({ ...newRating, review: e.target.value })
                }
                className="border rounded px-2 py-1 w-full text-black"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleRatingSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerRatingPage;
