import { useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import "../index.css";

function ProfilePage() {
  const [showSettings, setShowSettings] = useState(false);

  const recentWatches = [
    { id: 1, title: "Movie Title" },
    { id: 2, title: "Movie Title" },
    { id: 3, title: "Movie Title" },
    { id: 4, title: "Movie Title" },
    { id: 5, title: "Movie Title" },
    { id: 6, title: "Movie Title" },
    { id: 7, title: "Movie Title" },
    { id: 8, title: "Movie Title" },
    { id: 9, title: "Movie Title" }
  ];

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
                window.location.href = "/";}}>Log Out
              </p>
              <p className="delete-account-text">Delete Account</p>
            </div>
          )}
        </div>
      </div>

      <div className="recommend-btn-wrap">
        <button className="recommend-btn">Recommend me a film</button>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>Recent Watches</h2>
          <a href="/home">See more...</a>
        </div>

        <div className="movie-grid">
          {recentWatches.map((movie) => (
            <MovieCard key={movie.id} title={movie.title} />
          ))}
        </div>
      </div>

      <div className="profile-section">
        <div className="section-header">
          <h2>Recent Reviews</h2>
          <a href="/reviews">See more...</a>
        </div>

        <div className="recent-reviews-row">
          <div className="recent-reviews-box"></div>
          <div className="recent-reviews-box"></div>
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default ProfilePage;