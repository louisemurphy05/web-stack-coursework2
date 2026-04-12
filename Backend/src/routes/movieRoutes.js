import express from "express";
import 
{
  getAllMovies,
  getMovieById,
  getPopularMovies,
  getTrendingMovies,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  syncMovies,
  getMoviesByGenre,
  getRandomMovies
} 

from "../controllers/movieController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

// Movie routes for fetching movies, searching, and admin operations like adding/updating/deleting movies (which isn't functional)
const router = express.Router();

router.get("/", getAllMovies);
router.post("/sync/tmdb", syncMovies); 
router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/search", searchMovies);
router.get("/genre/:genreId", getMoviesByGenre); 
router.get("/random", getRandomMovies);
router.get("/:id", getMovieById);                  

router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);

export default router;