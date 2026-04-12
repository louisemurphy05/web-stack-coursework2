import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getRandomMovies } from "../api/movieApi";
import "../index.css";

function RecommendationsPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRandomMovies = async () => {
  setLoading(true);
  setError(null);
  try {
    console.log("Calling getRandomMovies with limit 16");
    const randomMovies = await getRandomMovies(16);
    console.log("Movies received:", randomMovies.length); // Should be 16
    setMovies(randomMovies.slice(0, 16));
  } catch (error) {
    console.error("Error fetching random movies:", error);
    setError("Failed to load movies. Please try again.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRandomMovies();
  }, []);

  const handleRandomize = () => {
    fetchRandomMovies();
  };

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