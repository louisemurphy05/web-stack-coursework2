import { useState } from "react";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="navbar">
      <button
        className="nav-icon-btn"
        onClick={() => (window.location.href = "/dashboard")}
>
        <span className="nav-icon">⌂</span>
      </button>

      <div className="admin-profile-menu-wrap">
        <button
          className="nav-icon-btn"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="nav-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
        </button>

        {showMenu && (
          <div className="admin-profile-menu">
            <p
              onClick={() => {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("adminUser");
                window.location.href = "/";}}>Sign Out
            </p>

            <p className="delete-account-text">Remove Account</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;