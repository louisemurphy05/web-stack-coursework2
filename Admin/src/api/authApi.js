import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Sends login request and stores token/user in localStorage
export const adminLogin = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    localStorage.setItem("adminToken", response.data.token);
    localStorage.setItem("adminUser", JSON.stringify(response.data));
  }
  
  return response.data;
};

// Clears stored admin session data
export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

// Retrieves current admin info from localStorage
export const getCurrentAdmin = () => {
  const user = localStorage.getItem("adminUser");
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Automatically adds auth token to outgoing requests
axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});