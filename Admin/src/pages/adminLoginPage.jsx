import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/authApi";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // TEMPORARY TEST LOGIN - Remove after testing! 
  if (username === "admin" && password === "admin") {
    localStorage.setItem("adminToken", "test-token");
    localStorage.setItem("adminUser", JSON.stringify({ username: "admin", isAdmin: true }));
    navigate("/dashboard");
    return;
  }
  //  END OF TEMPORARY CODE 
  
  setLoading(true);
  setError("");

  try {
    const user = await adminLogin(username, password);
    
    if (user.isAdmin) {
      navigate("/dashboard");
    } else {
      setError("Access denied. Admin privileges required.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>CineMatch Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-links">
            <a href="#" className="forgot-link">Forgot Password</a>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;