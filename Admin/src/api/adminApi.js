import axios from "axios";
import { getAuthToken } from "./authApi";

const API_URL = "http://localhost:5000/api/admin";

// Automatically attach auth token to every request if available
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

export const getAllUsers = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/users?page=${page}`);
    console.log("Users API response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response?.data || error.message);
    throw error;
  }
};

// Updates a user's details by ID
export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, userData);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axios.get(`${API_URL}/reviews`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`http://localhost:5000/api/admin/reviews/${reviewId}`);
  return response.data;
};

export const getAllMovies = async (page = 1) => {
  const response = await axios.get(`http://localhost:5000/api/movies?page=${page}`);
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const response = await axios.delete(`http://localhost:5000/api/movies/${movieId}`);
  return response.data;
};

export const addMovie = async (movieData) => {
  const response = await axios.post(`http://localhost:5000/api/movies`, movieData);
  return response.data;
};

export const updateMovie = async (movieId, movieData) => {
  const response = await axios.put(`http://localhost:5000/api/movies/${movieId}`, movieData);
  return response.data;
};

// Triggers backend sync with TMDB API
export const syncMoviesFromTMDB = async () => {
  const response = await axios.post(`http://localhost:5000/api/movies/sync/tmdb`);
  return response.data;
};