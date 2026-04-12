import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/adminLoginPage";
import DashboardPage from "./pages/dashboardPage";
import UsersPage from "./pages/userPage";
import MoviesPage from "./pages/moviesPage";
import ReviewsPage from "./pages/reviewsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;