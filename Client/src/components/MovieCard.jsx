function MovieCard({ movie, onClick }) {
  const posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') 
        ? movie.poster_path 
        : `https://image.tmdb.org/t/p/w200${movie.poster_path}`)
    : "https://via.placeholder.com/200x300?text=No+Poster";

  const getYear = () => {
    if (movie.release_date) {
      return movie.release_date.substring(0, 4);
    }
    return "N/A";
  };

  return (
    <div className="movie-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <img 
        src={posterUrl} 
        alt={movie.title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/200x300?text=No+Poster";
        }}
      />
      <p>{movie.title}</p>
      <p className="movie-year">{getYear()}</p>
    </div>
  );
}

export default MovieCard;