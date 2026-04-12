/**
 * Displays a grid of randomly selected movies for users who need inspiration.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getRandomMovies } from "../api/movieApi";
import "../index.css";

function RecommendationsPage() {
  // State variables
  const [movies, setMovies] = useState([]);    // Array of random movies
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null);     // Error message
  const navigate = useNavigate();

  /**
   * Fetch random movies from the API
   * Requests 16 random movies from the database
   */
  const fetchRandomMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Calling getRandomMovies with limit 16");
      const randomMovies = await getRandomMovies(16);
      console.log("Movies received:", randomMovies.length);
      setMovies(randomMovies.slice(0, 16));
    } catch (error) {
      console.error("Error fetching random movies:", error);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch random movies
  useEffect(() => {
    fetchRandomMovies();
  }, []);

  /**
   * Refresh the movie selection
   * Fetches a new set of random movies
   */
  const handleRandomize = () => {
    fetchRandomMovies();
  };

  /**
   * Navigate to movie details page when a movie is clicked
   * @param {string} movieId - TMDB ID of the selected movie
   */
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) {
    return (
      <div className="recommendations-container">
        <div className="recommendations-header">
          <div className="recommendations-brand">
            <span className="logo-icon">🎬</span>
            <h1>CineMatch</h1>
          </div>
        </div>
        <div className="loading-screen">Loading movie recommendations...</div>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      {/* Header with Randomize Button */}
      <div className="recommendations-header">
        <div className="recommendations-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>
        <button className="randomize-btn" onClick={handleRandomize}>
           Randomize Movies
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchRandomMovies}>Try Again</button>
        </div>
      )}

      <div className="recommendations-section">
        <div className="section-header">
          <h2> Random Movie Picks</h2>
        </div>
        
        {movies.length > 0 ? (
          <div className="movie-grid recommendations-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.tmdbId || movie.id} 
                movie={movie}
                onClick={() => handleMovieClick(movie.tmdbId || movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="no-movies-message">
            <p>No movies found. Please try randomizing again.</p>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}

export default RecommendationsPage;