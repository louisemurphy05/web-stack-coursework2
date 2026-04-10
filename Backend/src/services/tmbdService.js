import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    if (!this.apiKey) {
      console.warn("Warning: TMDB_API_KEY not set in environment variables");
    }
  }

  /**
   * Get full image URL
   * @param {string} path - Image path from TMDB
   * @param {string} size - Image size (w92, w154, w185, w342, w500, w780, original)
   * @returns {string|null} Full image URL or null
   */
  getImageUrl(path, size = "w500") {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  }

  /**
   * Make request to TMDB API
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @returns {Promise<object>} API response
   */
  async request(endpoint, params = {}) {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
        params: {
          api_key: this.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error(`TMDB API Error (${endpoint}):`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get popular movies
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of popular movies
   */
  async getPopularMovies(page = 1) {
    const data = await this.request("/movie/popular", { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get top rated movies
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of top rated movies
   */
  async getTopRatedMovies(page = 1) {
    const data = await this.request("/movie/top_rated", { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get now playing movies
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of now playing movies
   */
  async getNowPlaying(page = 1) {
    const data = await this.request("/movie/now_playing", { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get upcoming movies
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of upcoming movies
   */
  async getUpcoming(page = 1) {
    const data = await this.request("/movie/upcoming", { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get trending movies
   * @param {string} timeWindow - 'day' or 'week'
   * @returns {Promise<Array>} List of trending movies
   */
  async getTrending(timeWindow = "week") {
    const data = await this.request(`/trending/movie/${timeWindow}`);
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Search for movies
   * @param {string} query - Search query
   * @param {string} year - Release year (optional)
   * @param {number} genreId - Genre ID (optional)
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of matching movies
   */
  async searchMovies(query, year = null, genreId = null, page = 1) {
    const params = { query, page };
    if (year) params.year = year;
    if (genreId) params.with_genres = genreId;
    
    const data = await this.request("/search/movie", params);
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get detailed movie information
   * @param {number|string} movieId - TMDB movie ID
   * @returns {Promise<object>} Movie details
   */
  async getMovieDetails(movieId) {
    const data = await this.request(`/movie/${movieId}`);
    return {
      ...data,
      poster_path: this.getImageUrl(data.poster_path),
      backdrop_path: this.getImageUrl(data.backdrop_path, "original"),
      genres: data.genres
    };
  }

  /**
   * Get movie credits (cast and crew)
   * @param {number|string} movieId - TMDB movie ID
   * @returns {Promise<object>} Movie credits
   */
  async getMovieCredits(movieId) {
    const data = await this.request(`/movie/${movieId}/credits`);
    return {
      cast: data.cast.slice(0, 10),
      crew: data.crew.slice(0, 5)
    };
  }

  /**
   * Get movie videos (trailers, teasers)
   * @param {number|string} movieId - TMDB movie ID
   * @returns {Promise<Array>} Movie videos
   */
  async getMovieVideos(movieId) {
    const data = await this.request(`/movie/${movieId}/videos`);
    return data.results.filter(video => video.type === "Trailer" || video.type === "Teaser");
  }

  /**
   * Get list of all genres
   * @returns {Promise<Array>} List of genres
   */
  async getGenres() {
    const data = await this.request("/genre/movie/list");
    return data.genres;
  }

  /**
   * Discover movies by filters
   * @param {object} filters - Filter options
   * @returns {Promise<Array>} List of movies
   */
  async discoverMovies(filters = {}) {
    const params = {
      sort_by: filters.sortBy || "popularity.desc",
      page: filters.page || 1
    };
    
    if (filters.genreId) params.with_genres = filters.genreId;
    if (filters.year) params.primary_release_year = filters.year;
    if (filters.minRating) params["vote_average.gte"] = filters.minRating;
    if (filters.language) params.with_original_language = filters.language;
    
    const data = await this.request("/discover/movie", params);
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get movies by genre
   * @param {number} genreId - Genre ID
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of movies in genre
   */
  async getMoviesByGenre(genreId, page = 1) {
    return this.discoverMovies({ genreId, page });
  }

  /**
   * Get similar movies
   * @param {number|string} movieId - TMDB movie ID
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of similar movies
   */
  async getSimilarMovies(movieId, page = 1) {
    const data = await this.request(`/movie/${movieId}/similar`, { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }

  /**
   * Get recommendations for a movie
   * @param {number|string} movieId - TMDB movie ID
   * @param {number} page - Page number
   * @returns {Promise<Array>} List of recommended movies
   */
  async getRecommendations(movieId, page = 1) {
    const data = await this.request(`/movie/${movieId}/recommendations`, { page });
    return data.results.map(movie => ({
      ...movie,
      poster_path: this.getImageUrl(movie.poster_path),
      backdrop_path: this.getImageUrl(movie.backdrop_path, "original")
    }));
  }
}

export default new TMDBService();