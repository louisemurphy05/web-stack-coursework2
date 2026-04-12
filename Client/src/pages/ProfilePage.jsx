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
        headers: { "Authorization": `Bearer ${token}` }
      });
      const reviews = await reviewsRes.json();
      setUserReviews(reviews);

      const movies = await Promise.all(
        reviews.map(async (review) => {
          const movieRes = await fetch(`http://localhost:5000/api/movies/${review.movieId}`);
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
              <p className="delete-account-text">Delete Account</p>
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
            userReviews.slice(0, 2).map((review) => (
              <div key={review._id} className="recent-reviews-box">
                <p><strong>Movie: {watchHistory.find(m => m.tmdbId === review.movieId)?.title || "Loading..."}</strong></p>
                <p><strong>Year: {watchHistory.find(m => m.tmdbId === review.movieId)?.release_date?.substring(0, 4) || "N/A"}</strong></p>
                <p><strong>Rating: {review.rating}/5</strong></p>
                <p>{review.comment?.substring(0, 100)}</p>
              </div>
            ))
          ) : (
            <p className="empty-message">No reviews yet. Write your first review!</p>
          )}
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default ProfilePage;