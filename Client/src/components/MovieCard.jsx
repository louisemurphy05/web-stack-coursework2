function MovieCard({ movie }) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Poster";

  return (
    <div className="movie-card">
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="movie-poster"
      />
      <p>{movie.title}</p>
      <p className="movie-year">{movie.release_date?.substring(0, 4) || "N/A"}</p>
    </div>
  );
}

export default MovieCard;