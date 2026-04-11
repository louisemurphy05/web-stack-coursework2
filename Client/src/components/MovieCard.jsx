function MovieCard({ title }) {
  return (
    <div className="movie-card">
      <div className="movie-poster-placeholder"></div>
      <p>{title}</p>
    </div>
  );
}

export default MovieCard;