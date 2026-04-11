import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getTrendingMovies, searchMovies } from "../api/movieApi";
import "../index.css";

function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const trending = await getTrendingMovies();
      const popular = await getPopularMovies();
      setTrendingMovies(trending.slice(0, 9));
      setPopularMovies(popular.slice(0, 9));
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results.slice(0, 9));
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading movies...</div>;
  }

  return (
    <div className="homepage-container">
      <div className="homepage-top">
        <div className="homepage-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

    <input
        className="search-bar"
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
    </div>

      <div className="homepage-filters">
        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled hidden>By Genre</option>
          <option>Action</option>
          <option>Comedy</option>
          <option>Romance</option>
          <option>Horror</option>
          <option>Sci-Fi</option>
        </select>

        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled hidden>By Director</option>
          <option>Christopher Nolan</option>
          <option>Wes Anderson</option>
          <option>Steven Spielberg</option>
        </select>

        <select className="filter-dropdown" defaultValue="">
          <option value="" disabled hidden>Sort By</option>
          <option>Highest Rated to Lowest Rated</option>
          <option>Lowest Rated to Highest Rated</option>
        </select>
      </div>

      {isSearching ? (
        <div className="homepage-section">
          <div className="section-header">
            <h2>Search Results for "{searchQuery}"</h2>
            <a href="#" onClick={() => { setIsSearching(false); setSearchQuery(""); }}>Clear</a>
          </div>
          <div className="movie-grid">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="homepage-section">
            <div className="section-header">
              <h2>Trending Now</h2>
              <a href="/movies">See more...</a>
            </div>
            <div className="movie-grid">
              {trendingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>

          <div className="homepage-section">
            <div className="section-header">
              <h2>Popular Movies</h2>
              <a href="/movies">See more...</a>
            </div>
            <div className="movie-grid">
              {popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </>
      )}

      <Navbar />
    </div>
  );
}

export default HomePage;