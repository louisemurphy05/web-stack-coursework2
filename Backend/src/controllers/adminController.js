import User from "../models/User.js";
import Movie from "../models/Movie.js";
import Review from "../models/Review.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select("-password")
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const reviewCount = await Review.countDocuments({ userId: user._id });
    
    res.json({
      ...user.toObject(),
      reviewCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (Admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
    
    if (req.body.preferences) {
      user.preferences = req.body.preferences;
    }
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      preferences: updatedUser.preferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete all user's reviews
    await Review.deleteMany({ userId: user._id });
    await user.deleteOne();
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (Admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("userId", "username email")
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Movie.countDocuments();
    const totalReviews = await Review.countDocuments();
    const adminCount = await User.countDocuments({ isAdmin: true });
    
    // Get recent users
    const recentUsers = await User.find({})
      .select("username email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent reviews
    const recentReviews = await Review.find({})
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get top rated movies
    const allReviews = await Review.find({});
    const movieRatings = {};
    
    allReviews.forEach(review => {
      if (!movieRatings[review.movieId]) {
        movieRatings[review.movieId] = { sum: 0, count: 0 };
      }
      movieRatings[review.movieId].sum += review.rating;
      movieRatings[review.movieId].count++;
    });
    
    const topMovies = Object.entries(movieRatings)
      .map(([movieId, data]) => ({
        movieId,
        averageRating: data.sum / data.count,
        reviewCount: data.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5);
    
    // Get movie details for top movies
    const topMoviesWithDetails = await Promise.all(
      topMovies.map(async (item) => {
        const movie = await Movie.findOne({ tmdbId: item.movieId });
        return {
          ...item,
          title: movie?.title || "Unknown"
        };
      })
    );
    
    res.json({
      totalUsers,
      totalMovies,
      totalReviews,
      adminCount,
      recentUsers,
      recentReviews,
      topMovies: topMoviesWithDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};