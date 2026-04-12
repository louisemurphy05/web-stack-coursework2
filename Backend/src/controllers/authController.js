import User from "../models/User.js";
import Review from "../models/Review.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (id, isAdmin) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET || "your_secret_key",
    { expiresIn: "30d" }
  );
};

// Register new user
export const register = async (req, res) => {
  console.log("REGISTER endpoint called");
  console.log("Request body:", req.body);
  
  try {
    const { username, email, password } = req.body;
    console.log("Creating user:", username, email);

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      console.log("User already exists");
      return res.status(400).json({ 
        message: "User already exists with this email or username" 
      });
    }

    const user = await User.create({
      username,
      email,
      password
    });
    
    console.log("User created successfully, ID:", user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin)
    });
  } catch (error) {
    console.log("ERROR in register:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req, res) => {
  console.log("LOGIN endpoint called");
  console.log("Request body:", req.body);
  
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("Login successful for:", email);
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id, user.isAdmin)
    });
  } catch (error) {
    console.log("ERROR in login:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
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

// Delete user account 
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete all reviews by this user
    await Review.deleteMany({ userId: req.user.id });
    
    // Delete the user
    await user.deleteOne();
    
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: error.message });
  }
};