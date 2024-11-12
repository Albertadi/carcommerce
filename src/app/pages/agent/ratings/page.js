"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../authorization/AuthContext";
import { FaStar, FaUserCircle } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";

const AgentRatingsPage = () => {
  const { access_token } = useContext(AuthContext);
  const [agentReviews, setAgentReviews] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgentReviews = async () => {
      if (access_token) {
        setLoading(true); // Start loading

        const decodedToken = jwtDecode(access_token); // Decode the token
        const email = decodedToken.sub.email; // Get the email from the decoded token
  
        try {
          const response = await axios.get(
            `http://localhost:5000/api/reviewRating/${email}`, // Update this line to use the correct endpoint
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          const reviews = response.data.average_rating;  // Update this line to reference the correct field
          const averageRating = response.data.reviews;   // This should be the average rating, not reviews

          setAgentReviews({
            reviews: reviews,
            averageRating: averageRating ? averageRating.toFixed(1) : "No ratings yet",
          });
        } catch (error) {
          console.error("Error fetching agent reviews:", error);
        } finally {
          setLoading(false); // End loading
        }
      } else {
        setLoading(false);
      }
    };

    fetchAgentReviews(); // Call the function when the component mounts
  }, [access_token]); // Dependency array, it will run when `access_token` changes

  return (
    <div className="p-8">
      <h1 className="text-2xl font-rajdhaniBold mb-6 text-red-400">Your Agent Ratings</h1>

      {loading ? (
        <p className="font-rajdhaniMedium">Loading your ratings...</p>
      ) : (
        <div>
          {agentReviews && agentReviews.reviews && agentReviews.reviews.length > 0 ? (
            <>
              <h2 className="text-xl font-rajdhaniBold text-orange-500">
                Average Rating: {agentReviews.averageRating || "No ratings yet"}
              </h2>

              <div className="mt-4">
                <ul className="space-y-4">
                  {agentReviews.reviews.map((review, index) => (
                    <li key={index} className="flex items-center p-4 bg-gray-200 rounded-lg shadow-md">
                      <FaUserCircle className="text-red-700 text-5xl mr-4" />
                      <div className="flex-1">
                        <p className="text-black font-rajdhaniSemiBold">
                          {review.reviewerEmail || "Anonymous"}
                        </p>
                        <p className="text-gray-700 font-rajdhaniMedium">
                          {review.review || "No review text available"}
                        </p>
                      </div>
                      <div className="flex items-center ml-4">
                        <FaStar className="text-black text-xl" />
                        <span className="text-red-600 text-lg ml-2 font-rajdhaniSemiBold">
                          {review.rating || "No rating"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-500 font-rajdhaniMedium">No reviews found for this agent.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentRatingsPage;