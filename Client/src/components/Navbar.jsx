function Navbar() {
  return (
    <div className="navbar">
      <button className="nav-icon-btn" onClick={() => (window.location.href = "/home")}>
        <span className="nav-icon">⌂</span>
      </button>

      <button className="nav-icon-btn" onClick={() => (window.location.href = "/reviews")}>
        <span className="nav-icon">+</span>
      </button>

      <button className="nav-icon-btn" onClick={() => (window.location.href = "/profile")}>
        {/* change icon later */}
        <span className="nav-icon">!</span> 
      </button>
    </div>
  );
}

export default Navbar;