import React, { useState, useEffect } from "react";
import { getAllReviews, deleteReview } from "../api/adminApi";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.userId?.username?.toLowerCase().includes(search.toLowerCase()) ||
    review.comment?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading reviews...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Reviews</h1>
        <input
          type="text"
          placeholder="Search by user or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Review</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map(review => (
              <tr key={review._id}>
                <td>
                  <div className="review-rating">{"⭐".repeat(review.rating)}</div>
                  <div className="review-comment">{review.comment?.substring(0, 100)}</div>
                </td>
                <td>{review.userId?.username || "Unknown"}</td>
                <td>
                  <button onClick={() => handleDelete(review._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsPage;