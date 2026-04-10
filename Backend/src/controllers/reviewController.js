import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

// Add review for a movie
export const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    
    // Check if movie exists
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      userId: req.user.id,
      movieId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this movie" });
    }
    
    const review = await Review.create({
      userId: req.user.id,
      movieId,
      rating,
      comment
    });
    
    const populatedReview = await review.populate("userId", "username");
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a movie
export const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({
      reviews,
      averageRating: avgRating,
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    if (review.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review (Admin or review owner)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    if (review.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};