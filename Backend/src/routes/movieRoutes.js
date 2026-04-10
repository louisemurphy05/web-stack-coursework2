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
  syncMovies
} 

from "../controllers/movieController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/search", searchMovies);
router.get("/:id", getMovieById);

router.post("/", protect, adminOnly, addMovie);
router.put("/:id", protect, adminOnly, updateMovie);
router.delete("/:id", protect, adminOnly, deleteMovie);
router.post("/sync/tmdb", protect, adminOnly, syncMovies);

export default router;