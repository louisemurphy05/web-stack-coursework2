import React, { useState, useEffect } from "react";
import { getAllMovies, deleteMovie, syncMoviesFromTMDB, addMovie } from "../api/adminApi";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovie, setNewMovie] = useState({ title: "", year: "", tmdbId: "" });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data.movies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movieId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMovie(movieId);
        fetchMovies();
      } catch (error) {
        console.error("Failed to delete movie:", error);
      }
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncMoviesFromTMDB();
      alert(result.message);
      fetchMovies();
    } catch (error) {
      console.error("Failed to sync movies:", error);
      alert("Failed to sync movies. Check API key.");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddMovie = async () => {
    if (!newMovie.title || !newMovie.tmdbId) {
      alert("Please enter title and TMDB ID");
      return;
    }
    try {
      await addMovie({
        title: newMovie.title,
        tmdbId: newMovie.tmdbId,
        releaseDate: newMovie.year,
        description: "Movie added by admin"
      });
      setShowAddModal(false);
      setNewMovie({ title: "", year: "", tmdbId: "" });
      fetchMovies();
    } catch (error) {
      console.error("Failed to add movie:", error);
      alert("Failed to add movie");
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Movies</h1>
        <div className="header-buttons">
          <button onClick={() => setShowAddModal(true)} className="add-btn">
            + Add New Movie
          </button>
          <button onClick={handleSync} disabled={syncing} className="sync-btn">
            {syncing ? "Syncing..." : "Sync from TMDB"}
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="movies-table">
          <thead>
            <tr>
              <th>Picker</th>
              <th>Title / Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie._id}>
                <td className="picker-cell">
                  <input type="checkbox" className="movie-picker" />
                </td>
                <td className="title-cell">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-year">{movie.releaseDate?.substring(0, 4) || "N/A"}</div>
                </td>
                <td className="action-cell">
                  <button 
                    onClick={() => handleDelete(movie.tmdbId, movie.title)} 
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Movie</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="Movie title"
                />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="text"
                  value={newMovie.year}
                  onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
                  placeholder="Release year"
                />
              </div>
              <div className="form-group">
                <label>TMDB ID</label>
                <input
                  type="text"
                  value={newMovie.tmdbId}
                  onChange={(e) => setNewMovie({ ...newMovie, tmdbId: e.target.value })}
                  placeholder="TMDB movie ID"
                />
              </div>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleAddMovie} className="confirm-btn">Add Movie</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;