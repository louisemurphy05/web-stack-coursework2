import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";


export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};


export const getAllUsers = async (page = 1) => {
  const response = await axios.get(`${API_URL}/users?page=${page}`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, userData);
  return response.data;
};


export const getAllReviews = async () => {
  const response = await axios.get(`${API_URL}/reviews`);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
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


export const syncMoviesFromTMDB = async () => {
  const response = await axios.post(`http://localhost:5000/api/movies/sync/tmdb`);
  return response.data;
};