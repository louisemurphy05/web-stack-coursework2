import { useState } from "react";
import { registerUser } from "../api/authApi";
import "../index.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const data = await registerUser({ username, email, password });
      console.log("REGISTER SUCCESS:", data);
      window.location.href = "/login";
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <span className="logo-icon">🎬</span>
          <h1>CineMatch</h1>
        </div>

        <div className="register-form">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="register-buttons">

              <button
                className="register-btn" 
                // onClick={handleRegister}>Create Account
                onClick={() => (window.location.href = "/home")}>Create Account
              </button>

            <button
              className="login-btn"
              onClick={() => (window.location.href = "/login")}>Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;