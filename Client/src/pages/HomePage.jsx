import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { getPopularMovies, getTrendingMovies, searchMovies, getMoviesByGenre } from "../api/movieApi";
import "swiper/css";
import "../index.css";

function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [displayMovies, setDisplayMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

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
    
    if (isSearching) {
      setSearchResults(moviesToSort);
    } else if (isFiltering) {
      setDisplayMovies(moviesToSort);
    } else {
      setPopularMovies(moviesToSort);
    }
  };

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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>

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

        {(isFiltering || isSearching || selectedGenre || sortOrder) && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        )}
      </div>

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
          <div className="homepage-section">
            <div className="section-header">
              <h2>Trending Now</h2>
              <a href="/movies">See more...</a>
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

          <div className="homepage-section">
            <div className="section-header">
              <h2>Popular Movies</h2>
              <a href="/movies">See more...</a>
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