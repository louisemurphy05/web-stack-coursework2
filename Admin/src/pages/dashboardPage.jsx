import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../api/adminApi";
import { adminLogout, getCurrentAdmin } from "../api/authApi";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const admin = getCurrentAdmin();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      if (error.response?.status === 401) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  const handleRemoveAccount = async () => {
    try {
      // Call API to delete account
      await fetch("http://localhost:5000/api/auth/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });
      adminLogout();
      navigate("/");
    } catch (error) {
      console.error("Failed to remove account:", error);
    }
  };

  // Performance data for chart
  const performanceData = [
    { label: "Total Users", value: stats?.totalUsers || 0, max: 100 },
    { label: "Total Movies", value: stats?.totalMovies || 0, max: 200 },
    { label: "Total Reviews", value: stats?.totalReviews || 0, max: 500 }
  ];

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      {/* Header with Sign Out and Remove Account */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-actions">
          <button onClick={handleLogout} className="signout-btn">Sign Out</button>
          <button onClick={() => setShowConfirm(true)} className="remove-btn">Remove Account</button>
        </div>
      </div>

      {/* Confirmation Modal for Remove Account */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Remove Account</h3>
            <p>Are you sure you want to remove your admin account? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirm(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleRemoveAccount} className="confirm-remove-btn">Yes, Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Three Management Cards */}
      <div className="management-cards">
        <div className="manage-card" onClick={() => navigate("/users")}>
          <div className="card-icon">👥</div>
          <h3>Manage Users</h3>
          <p>View, edit, and delete user accounts</p>
        </div>
        
        <div className="manage-card" onClick={() => navigate("/movies")}>
          <div className="card-icon">🎬</div>
          <h3>Manage Movies</h3>
          <p>Add, edit, or remove movies</p>
        </div>
        
        <div className="manage-card" onClick={() => navigate("/reviews")}>
          <div className="card-icon">⭐</div>
          <h3>Manage Reviews</h3>
          <p>Moderate user reviews</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-section">
        <h2>Performance Chart</h2>
        <div className="chart-container">
          {performanceData.map((item, index) => {
            const percentage = (item.value / item.max) * 100;
            return (
              <div key={index} className="chart-bar-container">
                <div className="chart-label">{item.label}</div>
                <div className="chart-bar-wrapper">
                  <div 
                    className="chart-bar" 
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  >
                    <span className="chart-value">{item.value}</span>
                  </div>
                </div>
                <div className="chart-percentage">{Math.min(percentage, 100)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;