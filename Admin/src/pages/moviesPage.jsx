import React, { useState } from "react";
import AdminNavbar from "../components/adminNavbar";
import "../App.css";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: "", year: "", tmdbId: "" });

// Placeholder movies - will we bother with actual API calls for this?
  const placeholderMovies = [
    {
      id: 1,
      title: "Pulp Fiction",
      year: "1994",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
    },
    {
      id: 2,
      title: "Interstellar",
      year: "2014",
      poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
    },
    {
      id: 3,
      title: "The Dark Knight",
      year: "2008",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
    },
    {
      id: 4,
      title: "Fight Club",
      year: "1999",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
    }
  ];

  const filteredMovies = placeholderMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-movies-container">
      <div className="admin-top">
        <div className="admin-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>
      </div>

      <div className="admin-movies-section">
        <div className="admin-section-header">
          <h2>Manage Movies</h2>
        </div>

        <div className="admin-movies-toolbar">
          <button
            onClick={() => setShowAddPanel(!showAddPanel)}
            className="admin-add-movie-btn"
          >
            + Add new movie
          </button>

          <div className="search-wrapper">
            <input
              className="search-bar"
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-icon-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {showAddPanel && (
          <div className="admin-add-panel">
            <h3>Add New Movie</h3>

            <div className="admin-add-form-grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Release Year</label>
                <input
                  type="text"
                  value={newMovie.year}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, year: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>TMDB ID</label>
                <input
                  type="text"
                  value={newMovie.tmdbId}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, tmdbId: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="admin-add-panel-buttons">
              <button
                onClick={() => setShowAddPanel(false)}
                className="cancel-btn"
              >
                Cancel
              </button>

              <button className="confirm-btn">
                Add Movie
              </button>

              <button className="sync-btn">
                Sync from TMDB
              </button>
            </div>
          </div>
        )}

        <div className="admin-movies-table-wrap">
          <table className="admin-movies-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title / Year</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredMovies.map((movie) => {
                const posterUrl = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

                return (
                  <tr key={movie.id}>
                    <td className="poster-cell">
                      <img
                        src={posterUrl}
                        alt={movie.title}
                        className="admin-movie-poster"
                      />
                    </td>

                    <td className="title-year-cell">
                      <div className="admin-movie-title">
                        Movie Title: {movie.title}
                      </div>
                      <div className="admin-movie-year">
                        Release Year: {movie.year}
                      </div>
                    </td>

                    <td className="action-cell">
                      <button className="admin-edit-btn">Edit</button>
                      <button className="admin-delete-btn">Delete</button>
                    </td>
                  </tr>
                );
              })}

              {filteredMovies.length === 0 && (
                <tr>
                  <td colSpan="3" className="admin-empty-state">
                    No movies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
};

export default MoviesPage;