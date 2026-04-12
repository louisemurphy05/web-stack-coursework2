import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import "../index.css";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const reviewsRes = await fetch("http://localhost:5000/api/reviews/my-reviews", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reviews = await reviewsRes.json();
      setUserReviews(reviews);

      const uniqueMovieIds = [...new Set(reviews.map((review) => review.movieId))];

      const movies = await Promise.all(
        uniqueMovieIds.map(async (movieId) => {
          const movieRes = await fetch(`http://localhost:5000/api/movies/${movieId}`);
          const movie = await movieRes.json();
          return movie;
        })
      );

      setWatchHistory(movies);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this review?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete review");
        return;
      }

      await fetchUserData();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Account deleted successfully");
        navigate("/login");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete account");
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading profile...</div>;
  }

  return (
    <div className="profilepage-container">
      <div className="profile-header-bar">
        <div className="profile-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

        <div className="profile-settings-wrap">
          <button
            className="settings-icon-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙
          </button>

          {showSettings && (
            <div className="profile-settings-panel">
              <p>Change Username</p>
              <p>Change Password</p>
              <p onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}>Log Out</p>
              <p 
                className="delete-account-text"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="recommend-btn-wrap">
        <button 
          className="recommend-btn" 
          onClick={() => navigate("/recommendations")}
        >
          Recommend me a film
        </button>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>Recent Watches</h2>
        </div>
        <div className="watches-box">
          <div className="movie-grid">
            {watchHistory.length > 0 ? (
              watchHistory.slice(0, 8).map((movie) => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))
            ) : (
              <p className="empty-message">No movies watched yet. Write a review!</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>Recent Reviews</h2>
        </div>
        <div className="recent-reviews-row">
          {userReviews.length > 0 ? (
            userReviews.slice(0, 2).map((review) => {
              const matchingMovie = watchHistory.find(
                (m) => m.tmdbId === review.movieId
              );

              return (
                <div key={review._id} className="recent-reviews-box">
                  <button
                    className="delete-review-btn"
                    onClick={() => handleDeleteReview(review._id)}>Delete Review
                  </button>
                  <p><strong> Movie: '{matchingMovie?.title || "Loading..."}'</strong></p>
                  <p><strong>Year: {matchingMovie?.release_date?.substring(0, 4) || "N/A"}</strong></p>
                  <p><strong>Rating: {review.rating}/5</strong></p>
                  <p className="client-review">"{review.comment?.substring(0, 100)}"</p>
                </div>
              );
            })
          ) : (
            <p className="empty-message">No reviews yet. Write your first review!</p>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Popup */}
      {showDeleteConfirm && (
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
            <h3 style={{ color: "white", marginBottom: "20px" }}>Delete Account</h3>
            <p style={{ color: "#d9d9d9", marginBottom: "20px" }}>
              Are you sure you want to delete your account?
            </p>
            <p style={{ color: "#ff9999", marginBottom: "20px", fontSize: "14px" }}>
              This action cannot be undone. All your reviews and data will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "10px 20px",
                  background: "#2a2a2a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                style={{
                  padding: "10px 20px",
                  background: "#ad2727",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}

export default ProfilePage;