import express from "express";
import 
{
  addReview,
  getMovieReviews,
  getUserReviews,
  updateReview,
  deleteReview
} 

from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/movie/:movieId", getMovieReviews);
router.get("/my-reviews", protect, getUserReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;