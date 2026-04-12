/**
 * This is the primary page where users discover and browse movies.
 */

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getTrendingMovies, searchMovies, getMoviesByGenre } from "../api/movieApi";
import "swiper/css";
import "../index.css";

function HomePage() {
  // State variables
  const [trendingMovies, setTrendingMovies] = useState([]);     // Weekly trending movies
  const [popularMovies, setPopularMovies] = useState([]);       // Most popular movies
  const [displayMovies, setDisplayMovies] = useState([]);       // Movies filtered by genre
  const [searchResults, setSearchResults] = useState([]);       // Movies from search
  const [searchQuery, setSearchQuery] = useState("");           // Search input value
  const [isSearching, setIsSearching] = useState(false);        // Show search results mode
  const [loading, setLoading] = useState(true);                 // Loading indicator
  const [selectedGenre, setSelectedGenre] = useState("");       // Selected genre filter
  const [sortOrder, setSortOrder] = useState("");               // Sort by rating (highest/lowest)
  const [isFiltering, setIsFiltering] = useState(false);        // Show genre filter mode

  // Available movie genres with TMDB IDs
  const genres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 10749, name: "Romance" },
    { id: 27, name: "Horror" },
    { id: 878, name: "Sci-Fi" },
    { id: 18, name: "Drama" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  /**
   * Fetch trending and popular movies from API
   */
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const trending = await getTrendingMovies();
      const popular = await getPopularMovies();
      setTrendingMovies(trending);
      setPopularMovies(popular);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch movies by selected genre
   */
  const fetchMoviesByGenre = async (genreId) => {
    setLoading(true);
    setIsFiltering(true);
    try {
      const movies = await getMoviesByGenre(genreId);
      setDisplayMovies(movies);
    } catch (error) {
      console.error("Error fetching by genre:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle genre selection from dropdown
   * Fetches movies for selected genre
   */
  const handleGenreChange = async (e) => {
    const genreValue = e.target.value;
    setSelectedGenre(genreValue);
    
    if (genreValue) {
      const genre = genres.find(g => g.name === genreValue);
      if (genre) {
        await fetchMoviesByGenre(genre.id);
      }
    } else {
      setIsFiltering(false);
      setDisplayMovies([]);
    }
    setSortOrder("");
  };

  /**
   * Handle sorting by rating
   * Sorts currently displayed movies (search results, genre filter, or popular)
   */
  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    
    let moviesToSort = [];
    if (isSearching) {
      moviesToSort = [...searchResults];
    } else if (isFiltering) {
      moviesToSort = [...displayMovies];
    } else {
      moviesToSort = [...popularMovies];
    }
    
    if (order === "highest") {
      moviesToSort.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (order === "lowest") {
      moviesToSort.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
    }
    
    // Update the appropriate state based on current mode
    if (isSearching) {
      setSearchResults(moviesToSort);
    } else if (isFiltering) {
      setDisplayMovies(moviesToSort);
    } else {
      setPopularMovies(moviesToSort);
    }
  };

  /**
   * Handle movie search
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    setIsFiltering(false);
    setSelectedGenre("");
    setSortOrder("");
    
    try {
      const results = await searchMovies(searchQuery);
      setSearchResults(results.slice(0, 16));
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  /**
   * Trigger search on Enter key press
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Clear all active filters and return to default view
   * Resets search, genre filter, and sort order
   */
  const clearFilters = () => {
    setSelectedGenre("");
    setSortOrder("");
    setIsFiltering(false);
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    fetchMovies();
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

        <div className="search-wrapper">
          <input
            className="search-bar"
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-icon-btn" onClick={handleSearch}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Controls*/}
      <div className="homepage-filters">
        <select 
          className="filter-dropdown" 
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">By Genre</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.name}>{genre.name}</option>
          ))}
        </select>

        <select 
          className="filter-dropdown" 
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="">Sort By</option>
          <option value="highest">Highest Rated to Lowest Rated</option>
          <option value="lowest">Lowest Rated to Highest Rated</option>
        </select>

        {/* Show Clear Filters button only when filters are active */}
        {(isFiltering || isSearching || selectedGenre || sortOrder) && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Search Results */}
      {isSearching && (
        <div className="homepage-section">
          <div className="section-header">
            <h2>Search Results</h2>
          </div>
          <div className="movie-grid">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {/* Genre Filter*/}
      {isFiltering && !isSearching && (
        <div className="homepage-section">
          <div className="section-header">
            <h2>{selectedGenre} Movies</h2>
          </div>
          <div className="movie-grid">
            {displayMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}

      {!isSearching && !isFiltering && (
        <>
          {/* Trending Movies Carousel */}
          <div className="homepage-section">
            <div className="section-header">
              <h2>Trending Now</h2>
            </div>
            <Swiper
              modules={[]}
              slidesPerView={8}
              spaceBetween={18}
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 8 }
              }}
              className="movie-swiper"
              onSwiper={(swiper) => {
                window.trendingSwiper = swiper;
              }}
            >
              {trendingMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="carousel-buttons">
              <button className="carousel-btn prev" onClick={() => window.trendingSwiper?.slidePrev()}>◀ Prev</button>
              <button className="carousel-btn next" onClick={() => window.trendingSwiper?.slideNext()}>Next ▶</button>
            </div>
          </div>

          {/* Popular Movies Carousel */}
          <div className="homepage-section">
            <div className="section-header">
              <h2>Popular Movies</h2>
            </div>
            <Swiper
              modules={[]}
              slidesPerView={8}
              spaceBetween={18}
              breakpoints={{
                320: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 8 }
              }}
              className="movie-swiper"
              onSwiper={(swiper) => {
                window.popularSwiper = swiper;
              }}
            >
              {popularMovies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MovieCard movie={movie} />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="carousel-buttons">
              <button className="carousel-btn prev" onClick={() => window.popularSwiper?.slidePrev()}>◀ Prev</button>
              <button className="carousel-btn next" onClick={() => window.popularSwiper?.slideNext()}>Next ▶</button>
            </div>
          </div>
        </>
      )}

      <Navbar />
    </div>
  );
}

export default HomePage;