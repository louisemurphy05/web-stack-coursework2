import Movie from "../models/Movie.js";
import Review from "../models/Review.js";
import tmdbService from "../services/tmdbService.js";

// Get all movies 
export const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const genre = req.query.genre;
    const search = req.query.search;

    let query = {};
    if (genre) {
      query.genres = { $elemMatch: { name: { $regex: genre, $options: "i" } } };
    }
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const movies = await Movie.find(query).skip(skip).limit(limit);
    const total = await Movie.countDocuments(query);

    // Get average ratings for each movie
    const moviesWithRatings = await Promise.all(
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

    res.json({
      movies: moviesWithRatings,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviews = await Review.find({ movieId: movie.tmdbId }).populate("userId", "username");
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      ...movie.toObject(),
      averageRating: avgRating,
      reviews,
      reviewCount: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular movies
export const getPopularMovies = async (req, res) => {
  try {
    const popular = await tmdbService.getPopularMovies();
    res.json(popular);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending movies
export const getTrendingMovies = async (req, res) => {
  try {
    const trending = await tmdbService.getTrending();
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search movies
export const searchMovies = async (req, res) => {
  try {
    const { query, year, genre } = req.query;
    const results = await tmdbService.searchMovies(query, year, genre);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add movie (Admin only)
export const addMovie = async (req, res) => {
  try {
    const movieData = req.body;
    
    // Check if movie already exists
    const existingMovie = await Movie.findOne({ tmdbId: movieData.tmdbId });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie already exists" });
    }

    const movie = await Movie.create(movieData);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    Object.assign(movie, req.body);
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete movie (Admin only)
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.id });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    // Delete all reviews for this movie
    await Review.deleteMany({ movieId: movie.tmdbId });
    await movie.deleteOne();
    
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sync movies from TMDB
export const syncMovies = async (req, res) => {
  try {
    const popular = await tmdbService.getPopularMovies();
    let added = 0;
    let updated = 0;

    for (const movie of popular) {
      const existing = await Movie.findOne({ tmdbId: movie.id.toString() });
      if (!existing) {
        await Movie.create({
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          tmdbId: movie.id.toString(),
          popularity: movie.popularity,
          genres: movie.genre_ids?.map(id => ({ id, name: "" })) || []
        });
        added++;
      } else {
        existing.popularity = movie.popularity;
        await existing.save();
        updated++;
      }
    }
    
    res.json({ message: `Sync complete: ${added} added, ${updated} updated` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMoviesByGenre = async (req, res) => {
  try {
    const { genreId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdbService.getMoviesByGenre(genreId, page);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRandomMovies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 16;
    
    // Get random movies from database
    const movies = await Movie.aggregate([
      { $sample: { size: limit } }
    ]);
    
    // Get average ratings for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ movieId: movie.tmdbId });
        const avgRating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;
        return {
          ...movie.toObject(),
          averageRating: avgRating,
          reviewCount: reviews.length,
          poster_path: movie.poster_path || null
        };
      })
    );
    
    res.json(moviesWithRatings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};