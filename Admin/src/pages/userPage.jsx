import React, { useState } from "react";
import AdminNavbar from "../components/adminNavbar";
import "../App.css";

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

// placeholders - functionality for full mongodb intergration still to be done
  const placeholderUsers = [
    { id: 1, username: "alexander_smith", email: "a.s@gmail.com" },
    { id: 2, username: "john_doe", email: "j.d@gmail.com" },
    { id: 3, username: "ariana_grande", email: "thankunext@gmail.com" },
    { id: 4, username: "mary_brown", email: "m.b@gmail.com" }
  ];

  const filteredUsers = placeholderUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>username</th>
                <th>email</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                <>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="admin-user-username-cell">{user.username}</td>
                      <td className="admin-user-email-cell">{user.email}</td>
                      <td className="admin-user-action-cell">
                        <button className="admin-delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="3" className="admin-empty-state">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminNavbar />
    </div>
  );
};

export default UsersPage;