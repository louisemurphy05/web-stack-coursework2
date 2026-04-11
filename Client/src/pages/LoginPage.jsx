import { useState } from "react";
import { loginUser } from "../api/authApi";
import "../index.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const data = await loginUser({ email, password });
      console.log("LOGIN SUCCESS:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      window.location.href = "/home";
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

        <div className="login-form">
          {error && (
            <div className="error-box">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}
          
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />

          <a href="#" className="forgot">Forgot Password?</a>

          <div className="login-buttons">
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>

            <button className="register-btn" onClick={() => (window.location.href = "/register")}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;