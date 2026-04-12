import React, { useState } from "react";
import AdminNavbar from "../components/adminNavbar";
import "../App.css";

const ReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const placeholderReviews = [
    { id: 1, review: '"i thought this film was..."', username: "j.d@gmail.com" },
    { id: 2, review: '"alright"', username: "a.s@gmail.com" },
    { id: 3, review: '"i thought this film was..."', username: "thankunext@gmail.com" }
  ];

  const filteredReviews = placeholderReviews.filter((item) =>
    item.review.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
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
                filteredReviews.map((item) => (
                  <tr key={item.id}>
                    <td className="admin-review-text-cell">{item.review}</td>
                    <td className="admin-review-user-cell">{item.username}</td>
                    <td className="admin-review-action-cell">
                      <button className="admin-delete-btn">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="admin-empty-state">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
};

export default ReviewsPage;