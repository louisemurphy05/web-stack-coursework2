/**
 * Allows authenticated users to write and submit reviews for movies.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../index.css";

function ReviewPage() {
  // State variables
  const [filmName, setFilmName] = useState("");           // Search input
  const [thoughts, setThoughts] = useState("");            // Review comment
  const [rating, setRating] = useState(0);                 // Star rating (1-5)
  const [searchResults, setSearchResults] = useState([]);  // Movie search results
  const [selectedMovie, setSelectedMovie] = useState(null); // Movie being reviewed
  const [loading, setLoading] = useState(false);           // Search loading indicator
  const navigate = useNavigate();

  /**
   * Search for movies by title
   * Fetches from TMDB API via backend
   */
  const searchMovie = async () => {
    if (!filmName.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/movies/search?query=${filmName}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select a movie from search results
   * Sets selected movie and clears search results
   * @param {Object} movie - Selected movie object
   */
  const selectMovie = (movie) => {
    setSelectedMovie(movie);
    setFilmName(movie.title);
    setSearchResults([]);
  };

  /**
   * Submit review to backend
   * On success, redirects to profile page
   */
  const handleSubmit = async () => {
    // Validation checks
    if (!selectedMovie) {
      alert("Please select a movie from search results");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: selectedMovie.id.toString(),
          rating: rating,
          comment: thoughts
        })
      });

      if (response.ok) {
        alert("Review submitted successfully!");
        navigate("/profile");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="reviewpage-container">
      <div className="review-card">
        <h1>Review a Film!</h1>
        <div className="review-title-line"></div>

        <div className="review-form">
          {/* Movie Search Section */}
          <label>Search Film:</label>
          <div className="search-row">
            <input
              type="text"
              value={filmName}
              onChange={(e) => setFilmName(e.target.value)}
              placeholder="Enter movie title..."
            />
            <button onClick={searchMovie} disabled={loading} className="search-submit-btn">
              {loading ? "..." : "Search"}
            </button>
          </div>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((movie) => (
                <div key={movie.id} className="search-result-item" onClick={() => selectMovie(movie)}>
                  <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} />
                  <div>
                    <strong>{movie.title}</strong>
                    <p>{movie.release_date?.substring(0, 4)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}


          {selectedMovie && (
            <div className="selected-movie">
              <p><strong>✓ {selectedMovie.title}</strong> ({selectedMovie.release_date?.substring(0, 4)})</p>
            </div>
          )}

          <label>Your thoughts on this film:</label>
          <div className="review-textarea-box">
            <textarea
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              placeholder="Write your review here..."
            />

            {/* Star Rating Selector */}
            <div className="review-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                    key={star}
                    className="star"
                    onClick={() => setRating(star)}
                    >
                    {star <= rating ? "★" : "☆"}
                    </span>
                ))}
            </div>
          </div>

           {/* Submit Button */}
          <button className="submit-review-btn" onClick={handleSubmit}>
            Submit Review
          </button>
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default ReviewPage;