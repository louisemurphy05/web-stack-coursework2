import express from "express";
import 
{
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllReviews,
  getDashboardStats
} 

from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, getDashboardStats);

router.get("/users", protect, adminOnly, getAllUsers);
router.get("/users/:id", protect, adminOnly, getUserById);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/reviews", protect, adminOnly, getAllReviews);

export default router;