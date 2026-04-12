import axios from "axios";

const API_URL = "http://localhost:5000/api/movies";

export const getPopularMovies = async (page = 1) => {
  const response = await axios.get(`${API_URL}/popular?page=${page}`);
  return response.data;
};

export const getTrendingMovies = async () => {
  const response = await axios.get(`${API_URL}/trending`);
  return response.data;
};

export const searchMovies = async (query, year = null, genre = null) => {
  let url = `${API_URL}/search?query=${query}`;
  if (year) url += `&year=${year}`;
  if (genre) url += `&genre=${genre}`;
  const response = await axios.get(url);
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const getMoviesByGenre = async (genreId, page = 1) => {
  const response = await axios.get(`${API_URL}/genre/${genreId}?page=${page}`);
  return response.data;
};
