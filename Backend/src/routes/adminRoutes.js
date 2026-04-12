import express from "express";
import 
{
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllReviews,
  deleteReview,
  getDashboardStats
} 
from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

router.get("/users", protect, getAllUsers);
router.get("/users/:id", protect, getUserById);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

router.get("/reviews", protect, adminOnly, getAllReviews);
router.delete("/reviews/:id", protect, adminOnly, deleteReview);

export default router;