import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import "../index.css";

// filler for now until we sort api key for tmdb
function HomePage() {
  const fakeMovies = [
    { id: 1, title: "example" },
    { id: 2, title: "example" },
    { id: 3, title: "example" },
    { id: 4, title: "example" },
    { id: 5, title: "example" },
    { id: 6, title: "example" },
    { id: 7, title: "example" },
    { id: 8, title: "example" },
    { id: 9, title: "example" }
  ];

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
        />
      </div>

{/* will sort out the onClicks for filter options later - all will bring to movies page - to the sepcified option chosen tho */}
      <div className="homepage-filters">
        <select className="filter-dropdown"  defaultValue="">
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


      <div className="homepage-section">
        <div className="section-header">
          <h2>Recommended</h2>
          <a href="/movies">See more...</a>
        </div>

        <div className="movie-grid">
          {fakeMovies.slice(0, 9).map((movie) => (
            <MovieCard key={movie.id} title={movie.title} />
          ))}
        </div>
      </div>

      <div className="homepage-section">
        <div className="section-header">
          <h2>New Releases</h2>
          <a href="/movies">See more...</a>
        </div>

        <div className="movie-grid">
          {fakeMovies.slice(0, 9).map((movie) => (
            <MovieCard key={movie.id} title={movie.title} />
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
}

export default HomePage;