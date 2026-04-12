import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/adminNavbar";
import { getAllReviews, deleteReview } from "../api/adminApi";
import "../App.css";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviews();
      console.log("Fetched reviews:", data);
      setReviews(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      await fetchReviews();
      setShowConfirm(null);
    } catch (err) {
      console.error("Failed to delete review:", err);
      setError("Failed to delete review");
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-reviews-container">
      <div className="admin-top">
        <div className="admin-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>
      </div>

      <div className="admin-reviews-section">
        <div className="admin-section-header admin-reviews-header">
          <h2>Manage Reviews</h2>

          <div className="search-wrapper admin-reviews-search">
            <input
              className="search-bar"
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="error-box" style={{ marginBottom: "20px" }}>
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading-state" style={{ textAlign: "center", padding: "40px", color: "#d9d9d9" }}>
            Loading reviews...
          </div>
        ) : (
          <div className="admin-reviews-table-wrap">
            <table className="admin-reviews-table">
              <thead>
                <tr>
                  <th>Review</th>
                  <th>Username</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <tr key={review._id}>
                      <td className="admin-review-text-cell">
                        {review.comment || "No comment"}
                        {review.movieTitle && (
                          <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>
                            Movie: {review.movieTitle}
                          </div>
                        )}
                      </td>
                      <td className="admin-review-user-cell">
                        {review.userId?.username || "Unknown User"}
                      </td>
                      <td className="admin-review-action-cell">
                        <button 
                          className="admin-delete-btn"
                          onClick={() => setShowConfirm(review)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="admin-empty-state">
                      {searchQuery ? "No reviews found matching your search" : "No reviews found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Popup - Same style as Users page */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#1a1919",
            padding: "30px",
            borderRadius: "15px",
            maxWidth: "400px",
            textAlign: "center",
            border: "1px solid #2a2a2a"
          }}>
            <h3 style={{ color: "white", marginBottom: "20px" }}>Confirm Delete</h3>
            <p style={{ color: "#d9d9d9", marginBottom: "20px" }}>
              Are you sure you want to delete this review from "{showConfirm.userId?.username}"?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={() => setShowConfirm(null)}
                style={{
                  padding: "10px 20px",
                  background: "#2a2a2a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showConfirm._id)}
                style={{
                  padding: "10px 20px",
                  background: "#ad2727",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
};

export default ReviewsPage;