import { useState } from "react";
import { loginUser } from "../api/authApi";
import "../index.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // commented out for now, might not use this
  // const handleLogin = async () => {
  //   try {
  //     const data = await loginUser({ username, password });
  //     console.log("LOGIN SUCCESS:", data);
  //     localStorage.setItem("token", data.token);
  //     window.location.href = "/home";
  //   } catch (error) {
  //     console.log("LOGIN ERROR:", error.response?.data || error.message);
  //   }
  // };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

        <div className="login-form">
          <label>Email Address</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="#" className="forgot">Forgot Password?</a>

          <div className="login-buttons">

              <button
                className="login-btn" 
                // onClick={handleLogin}>Login
                onClick={() => (window.location.href = "/home")}>Login
              </button>

              <button
                className="register-btn"
                onClick={() => (window.location.href = "/register")}>Register
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;