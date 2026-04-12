function Navbar() {
  return (
    <div className="navbar">
      <button className="nav-icon-btn" onClick={() => (window.location.href = "/home")}>
        <span className="nav-icon">⌂</span>
      </button>

      <button className="nav-icon-btn" onClick={() => (window.location.href = "/profile")}>
        <span className="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </span>
      </button>
    </div>
  );
}

export default Navbar;