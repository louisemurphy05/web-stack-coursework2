import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/adminNavbar";
import { getAllUsers, deleteUser } from "../api/adminApi";
import "../App.css";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

// Fetches all users from backend (mongodb) and handles loading/error states
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

// Handles user deletion with confirmation popup, calls delete API and refreshes users list on success
  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      await fetchUsers(); // Refresh the list
      setShowConfirm(null);
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-users-container">
        <div className="admin-top">
          <div className="admin-brand">
            <span className="logo-icon">🎬</span>
            <h1>CineMatch</h1>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "40px", color: "white" }}>Loading users...</div>
        <AdminNavbar />
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-top">
        <div className="admin-brand">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>
      </div>

      <div className="admin-users-section">
        <div className="admin-section-header admin-users-header">
          <h2>Manage Users</h2>

          <div className="search-wrapper admin-users-search">
            <input
              className="search-bar"
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {error && <div style={{ color: "red", padding: "10px", textAlign: "center" }}>{error}</div>}

{/* Users table with delete button (disabled for admins) and search functionality - calls delete API and refreshes list on delete, with confirmation popup */}
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className="admin-delete-btn"
                      onClick={() => setShowConfirm(user)}
                      disabled={user.isAdmin}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "40px" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple confirmation popup */}
      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#1a1919",
            padding: "30px",
            borderRadius: "15px",
            maxWidth: "400px",
            textAlign: "center",
            border: "1px solid #2a2a2a"
          }}>
            <h3 style={{ color: "white", marginBottom: "20px" }}>Confirm Delete</h3>
            <p style={{ color: "#d9d9d9", marginBottom: "20px" }}>
              Are you sure you want to delete "{showConfirm.username}"?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button 
                onClick={() => setShowConfirm(null)}
                style={{
                  padding: "10px 20px",
                  background: "#2a2a2a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showConfirm._id)}
                style={{
                  padding: "10px 20px",
                  background: "#ad2727",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminNavbar />
    </div>
  );
};

export default UsersPage;