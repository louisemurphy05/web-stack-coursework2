import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/authApi";
import "../App.css";

// Admin login page component with form and error handling
const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    // admin login bypass - didn't implement admin user creation so have to use this
    if (email === "admin" && password === "admin") {
      localStorage.setItem("adminToken", "test-token");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({ email: "admin", isAdmin: true })
      );
      navigate("/dashboard");
      return;
    }

    setLoading(true);

    try {
      const user = await adminLogin(email, password);

      localStorage.setItem("adminToken", user.token);
      localStorage.setItem("adminUser", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

// Renders login form with email/password fields, error messages, and login button
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

        <p className="admin-login-message">ADMIN LOGIN</p>

        <div className="login-form">
          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          <label>Email Address</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <a href="#" className="forgot">Forgot Password?</a>

          <div className="login-buttons admin-login-buttons">
            <button className="login-btn" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;