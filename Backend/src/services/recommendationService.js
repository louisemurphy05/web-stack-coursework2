import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import User from "../models/User.js";

/**
 * Get personalized recommendations for a user based on their ratings and preferences
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} List of recommended movies
 */
export const getPersonalizedRecommendations = async (userId, limit = 20) => {
  try {
    // Get user's preferences and watch history
    const user = await User.findById(userId);
    if (!user) return [];
    
    // Get user's rated movies
    const userReviews = await Review.find({ userId }).select("movieId rating");
    const ratedMovieIds = userReviews.map(r => r.movieId);
    
    // If user hasn't rated any movies, return popular movies
    if (ratedMovieIds.length === 0) {
      return await getPopularMoviesNotRated(ratedMovieIds, limit);
    }
    
    // Calculate genre preferences based on user's ratings
    const genreScores = await calculateGenreScores(userReviews);
    
    // Get top 3 favorite genres
    const topGenres = Array.from(genreScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);
    
    let recommendations = [];
    
    // Get recommendations based on favorite genres
    if (topGenres.length > 0) {
      const genreRecommendations = await getMoviesByGenresNotRated(
        topGenres,
        ratedMovieIds,
        limit
      );
      recommendations = [...genreRecommendations];
    }
    
    // If not enough recommendations, add popular movies
    if (recommendations.length < limit) {
      const popularMovies = await getPopularMoviesNotRated(
        ratedMovieIds,
        limit - recommendations.length
      );
      recommendations = [...recommendations, ...popularMovies];
    }
    
    // Get collaborative filtering recommendations (users with similar tastes)
    if (recommendations.length < limit) {
      const collaborativeRecs = await getCollaborativeRecommendations(
        userId,
        ratedMovieIds,
        limit - recommendations.length
      );
      recommendations = [...recommendations, ...collaborativeRecs];
    }
    
    // Add average ratings to recommendations
    const recommendationsWithRatings = await addRatingsToMovies(recommendations);
    
    return recommendationsWithRatings.slice(0, limit);
  } catch (error) {
    console.error("Recommendation error:", error);
    return [];
  }
};

/**
 * Get similar movies based on a specific movie
 * @param {string} movieId - TMDB movie ID
 * @param {number} limit - Maximum number of similar movies
 * @returns {Promise<Array>} List of similar movies
 */
export const getSimilarMovies = async (movieId, limit = 10) => {
  try {
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) return [];
    
    // Find movies with similar genres
    const movieGenres = movie.genres?.map(g => g.name) || [];
    
    if (movieGenres.length === 0) {
      return await getPopularMoviesNotRated([movieId], limit);
    }
    
    const similar = await Movie.find({
      tmdbId: { $ne: movieId },
      "genres.name": { $in: movieGenres }
    })
      .sort({ popularity: -1 })
      .limit(limit);
    
    const similarWithRatings = await addRatingsToMovies(similar);
    return similarWithRatings;
  } catch (error) {
    console.error("Similar movies error:", error);
    return [];
  }
};

/**
 * Get movies based on genre affinity
 * @param {string} userId - User ID
 * @param {number} limit - Maximum number of movies
 * @returns {Promise<Array>} Genre-based recommendations
 */
export const getGenreBasedRecommendations = async (userId, limit = 20) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.preferences?.favoriteGenres?.length) {
      return await getPopularMoviesNotRated([], limit);
    }
    
    const favoriteGenres = user.preferences.favoriteGenres;
    const userReviews = await Review.find({ userId }).select("movieId");
    const ratedMovieIds = userReviews.map(r => r.movieId);
    
    const recommendations = await Movie.find({
      tmdbId: { $nin: ratedMovieIds },
      "genres.name": { $in: favoriteGenres }
    })
      .sort({ popularity: -1 })
      .limit(limit);
    
    return await addRatingsToMovies(recommendations);
  } catch (error) {
    console.error("Genre-based recommendation error:", error);
    return [];
  }
};

/**
 * Calculate genre preference scores based on user ratings
 * @param {Array} userReviews - User's reviews with rating and movie data
 * @returns {Promise<Map>} Map of genre names to scores
 */
const calculateGenreScores = async (userReviews) => {
  const genreScores = new Map();
  
  for (const review of userReviews) {
    const movie = await Movie.findOne({ tmdbId: review.movieId });
    if (movie && movie.genres) {
      // Normalize rating to 0-1 scale and weight it
      const normalizedRating = review.rating / 5;
      movie.genres.forEach(genre => {
        const currentScore = genreScores.get(genre.name) || 0;
        genreScores.set(genre.name, currentScore + normalizedRating);
      });
    }
  }
  
  return genreScores;
};

/**
 * Get movies by genres that user hasn't rated
 * @param {Array} genres - List of genre names
 * @param {Array} excludeIds - Movie IDs to exclude
 * @param {number} limit - Maximum number of movies
 * @returns {Promise<Array>} List of movies
 */
const getMoviesByGenresNotRated = async (genres, excludeIds, limit) => {
  return await Movie.find({
    tmdbId: { $nin: excludeIds },
    "genres.name": { $in: genres }
  })
    .sort({ popularity: -1 })
    .limit(limit);
};

/**
 * Get popular movies that user hasn't rated
 * @param {Array} excludeIds - Movie IDs to exclude
 * @param {number} limit - Maximum number of movies
 * @returns {Promise<Array>} List of popular movies
 */
const getPopularMoviesNotRated = async (excludeIds, limit) => {
  return await Movie.find({
    tmdbId: { $nin: excludeIds }
  })
    .sort({ popularity: -1 })
    limit(limit);
};

/**
 * Get collaborative filtering recommendations based on similar users
 * @param {string} userId - Current user ID
 * @param {Array} userRatedIds - Movies user has rated
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} Collaborative recommendations
 */
const getCollaborativeRecommendations = async (userId, userRatedIds, limit) => {
  try {
    // Get user's rated movies with ratings
    const userReviews = await Review.find({ userId }).select("movieId rating");
    const userRatingMap = new Map();
    userReviews.forEach(review => {
      userRatingMap.set(review.movieId, review.rating);
    });
    
    // Find users who rated similar movies
    const similarUsers = await Review.aggregate([
      { $match: { movieId: { $in: userRatedIds }, userId: { $ne: userId } } },
      { $group: { _id: "$userId", commonMovies: { $push: "$movieId" } } },
      { $sort: { commonMovies: -1 } },
      { $limit: 10 }
    ]);
    
    if (similarUsers.length === 0) return [];
    
    // Get movies rated by similar users that current user hasn't seen
    const similarUserIds = similarUsers.map(u => u._id);
    const similarUserReviews = await Review.find({
      userId: { $in: similarUserIds },
      movieId: { $nin: userRatedIds }
    })
      .select("movieId rating userId")
      .limit(limit * 2);
    
    // Score movies based on ratings from similar users
    const movieScores = new Map();
    similarUserReviews.forEach(review => {
      const currentScore = movieScores.get(review.movieId) || 0;
      movieScores.set(review.movieId, currentScore + review.rating);
    });
    
    // Get top scoring movies
    const topMovieIds = Array.from(movieScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([movieId]) => movieId);
    
    const recommendations = await Movie.find({
      tmdbId: { $in: topMovieIds }
    });
    
    return recommendations;
  } catch (error) {
    console.error("Collaborative filtering error:", error);
    return [];
  }
};

/**
 * Add average ratings and review counts to movies
 * @param {Array} movies - List of movie objects
 * @returns {Promise<Array>} Movies with ratings added
 */
const addRatingsToMovies = async (movies) => {
  return await Promise.all(
    movies.map(async (movie) => {
      const reviews = await Review.find({ movieId: movie.tmdbId });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      return {
        ...movie.toObject(),
        averageRating: avgRating,
        reviewCount: reviews.length
      };
    })
  );
};

/**
 * Get trending recommendations (popular and highly rated)
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} Trending movies
 */
export const getTrendingRecommendations = async (limit = 20) => {
  try {
    const movies = await Movie.find()
      .sort({ popularity: -1 })
      .limit(limit);
    
    return await addRatingsToMovies(movies);
  } catch (error) {
    console.error("Trending recommendations error:", error);
    return [];
  }
};

/**
 * Get top rated recommendations
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} Top rated movies
 */
export const getTopRatedRecommendations = async (limit = 20) => {
  try {
    // Get all movies with their average ratings
    const allMovies = await Movie.find();
    const moviesWithRatings = await addRatingsToMovies(allMovies);
    
    // Sort by average rating
    const sorted = moviesWithRatings
      .filter(m => m.reviewCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
    
    // If not enough rated movies, add popular ones
    if (sorted.length < limit) {
      const popularMovies = await Movie.find({
        tmdbId: { $nin: sorted.map(m => m.tmdbId) }
      })
        .sort({ popularity: -1 })
        .limit(limit - sorted.length);
      
      const popularWithRatings = await addRatingsToMovies(popularMovies);
      sorted.push(...popularWithRatings);
    }
    
    return sorted;
  } catch (error) {
    console.error("Top rated recommendations error:", error);
    return [];
  }
};

/**
 * Get hybrid recommendations (combination of multiple strategies)
 * @param {string} userId - User ID (optional)
 * @param {number} limit - Maximum number of recommendations
 * @returns {Promise<Array>} Hybrid recommendations
 */
export const getHybridRecommendations = async (userId = null, limit = 20) => {
  try {
    if (userId) {
      // For logged-in users: 70% personalized, 30% trending
      const personalized = await getPersonalizedRecommendations(userId, Math.floor(limit * 0.7));
      const trending = await getTrendingRecommendations(Math.ceil(limit * 0.3));
      
      // Combine and remove duplicates
      const combined = [...personalized];
      const existingIds = new Set(combined.map(m => m.tmdbId));
      
      for (const movie of trending) {
        if (!existingIds.has(movie.tmdbId) && combined.length < limit) {
          combined.push(movie);
          existingIds.add(movie.tmdbId);
        }
      }
      
      return combined;
    } else {
      // For non-logged-in users: trending recommendations
      return await getTrendingRecommendations(limit);
    }
  } catch (error) {
    console.error("Hybrid recommendations error:", error);
    return [];
  }
};