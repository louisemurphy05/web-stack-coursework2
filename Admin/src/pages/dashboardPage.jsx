import React from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/adminNavbar";
import "../App.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const performanceData = [
    { label: "Users", value: 90, className: "bar-1" },
    { label: "Movies", value: 120, className: "bar-2" },
    { label: "Reviews", value: 80, className: "bar-3" },
    { label: "Activity", value: 150, className: "bar-4" }
  ];

  return (
    <div className="admin-dashboard-container">
      <div className="admin-top">
        <div className="admin-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Dashboard</h2>
        </div>

        <div className="admin-management-links">
          <button onClick={() => navigate("/users")}>✎ Manage Users</button>
          <button onClick={() => navigate("/movies")}>✎ Manage Movies</button>
          <button onClick={() => navigate("/reviews")}>✎ Manage Reviews</button>
        </div>

        <div className="admin-performance-section">
          <div className="admin-performance-header">
            <h2>Performance</h2>
          </div>

          <div className="admin-chart">
            {performanceData.map((item, index) => (
              <div key={index} className="admin-chart-column">
                <div className="admin-chart-bar-area">
                  <div
                    className={`admin-chart-bar ${item.className}`}
                    style={{ height: `${item.value}%` }}
                  />
                </div>
                <span className="admin-chart-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
};

export default DashboardPage;