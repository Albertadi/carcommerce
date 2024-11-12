"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../authorization/AuthContext";
import { FaStar, FaUserCircle } from "react-icons/fa";

const SellerRatingPage = () => {
  const { access_token } = useContext(AuthContext);

  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentReviews, setSelectedAgentReviews] = useState(null);
  const [showCreateRatingModal, setShowCreateRatingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newRating, setNewRating] = useState({
    rating: 0,
    review: "",
    agent_email: "",
  });

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");

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
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching agents:", error);
        setIsLoading(false)
      }
    };

    fetchAgents();
  }, [searchTerm, access_token]);

  // Fetch reviews and average rating for a specific agent
  const handleViewAllRatings = async (agentEmail) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviewRating/${agentEmail}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
  
      // Log the full response to inspect its structure
      console.log("Response Data:", response.data);
  
      const reviews = response.data.average_rating; // Here we get the reviews as an array of review objects
      let averageRating = response.data.reviews;  // This holds the average rating value
  
      // Round the average rating to one decimal place
      if (averageRating && !isNaN(averageRating)) {
        averageRating = averageRating.toFixed(1);  // Round to one decimal place
      }
  
      if (Array.isArray(reviews) && reviews.length > 0) {
        setSelectedAgentReviews({
          email: agentEmail,
          reviews: reviews, // Passing the reviews (array of review objects)
          averageRating: averageRating || "No rating available",  // Display average rating if available
        });
        setShowReviewModal(true); // Show the review modal
      } else {
        // No reviews found, display a friendly message
        setSelectedAgentReviews({
          email: agentEmail,
          reviews: [],
          averageRating: "No reviews available",
        });
        setShowReviewModal(true); // Still show the modal but with the message
      }
    } catch (error) {
      // Handle 404 or other errors
      if (error.response && error.response.status === 404) {
        setSelectedAgentReviews({
          email: agentEmail,
          reviews: [],
          averageRating: "No reviews available", // Set message for no reviews
        });
        setShowReviewModal(true);
      } else {
        console.error("Error fetching reviews:", error);
        // Optional: Show a generic error message to the user
        setSelectedAgentReviews({
          email: agentEmail,
          reviews: [],
          averageRating: "Error fetching reviews",
        });
        setShowReviewModal(true);

      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show the rating form and set agent email
  const handleSubmitNewRating = (agentEmail) => {
    setShowCreateRatingModal(true);
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
        // Set success message and start 7 second timer
        setSuccessMessage("Rating submitted successfully!");
        setShowCreateRatingModal(false);
        setNewRating({ rating: 0, review: "", agent_email: "" });

        // Hide the success message after 7 seconds
        setTimeout(() => setSuccessMessage(""), 7000);
      }
    } catch (error) {
      setInvalidMessage("Error submitting rating:", error);
      setSuccessMessage(""); // Hide success message if error occurs
    }
  };

  // Handle star click to set rating
  const handleStarClick = (index) => {
    setNewRating((prev) => ({ ...prev, rating: index + 1 }));
  };

  return (
    <div className="bg-white min-h-screen shadow-sm py-6 p-8">



      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 font-rajdhaniMedium">
          {successMessage}
        </div>
      )}

      {invalidMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 font-rajdhaniMedium">
          {invalidMessage}
        </div>
      )}

      <h1 className="text-2xl font-rajdhaniBold mb-6 text-red-400">Review Agents</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by first name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-2 py-1 w-full text-black font-rajdhaniMedium"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center items-center mt-4">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-solid border-gray-300 border-t-[#f75049]"></div>
        </div>
      )}

      {isLoading ? (
        <p className="font-rajdhaniMedium">Loading agents...</p>
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
                    <p className="text-black font-rajdhaniBold">
                      {agent.first_name} {agent.last_name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewAllRatings(agent.email)}
                  className="mt-2 mr-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-rajdhaniMedium"
                >
                  View All Ratings
                </button>

                <button
                  onClick={() => handleSubmitNewRating(agent.email)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-rajdhaniMedium"
                >
                  Submit a New Rating
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 font-rajdhaniMedium">No agents found.</p>
          )}
        </div>
      )}

      {showCreateRatingModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[700px]">
            <h2 className="text-xl font-rajdhaniBold text-orange-500">
              Submit a New Rating
            </h2>

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

            <div className="mt-4">
              <label className="block font-rajdhaniSemiBold">Review:</label>
              <textarea
                value={newRating.review}
                onChange={(e) =>
                  setNewRating({ ...newRating, review: e.target.value })
                }
                className="border rounded px-2 py-1 w-full text-black font-rajdhaniMedium"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleRatingSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-rajdhaniMedium"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowCreateRatingModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-rajdhaniMedium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-rajdhaniBold text-orange-500">
              Ratings for {selectedAgentReviews?.email}
            </h2>

            <h3 className="mt-4 text-lg font-rajdhaniBold text-orange-500">
              Average Rating: {selectedAgentReviews?.averageRating}
            </h3>

            <div className="mt-4 max-h-60 overflow-y-auto">
              <ul className="space-y-4">
                {selectedAgentReviews?.reviews.map((review, index) => (
                  <li
                    key={index}
                    className="flex items-center p-4 bg-gray-200 rounded-lg shadow-md w-full"
                  >
                    <FaUserCircle className="text-red-700 text-5xl mr-4" />
                    <div className="flex-1">
                      <p className="text-black font-rajdhaniSemiBold">
                        {review.reviewerEmail}
                      </p>
                      <p className="text-gray-700 font-rajdhaniMedium">{review.review}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      <FaStar className="text-black text-xl" />
                      <span className="text-red-600 text-lg ml-2 font-rajdhaniSemiBold">
                        {review.rating}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowReviewModal(false)}
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-rajdhaniMedium"
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
