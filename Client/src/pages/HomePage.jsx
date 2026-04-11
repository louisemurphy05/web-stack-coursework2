import Navbar from "../components/Navbar";
import "../index.css";

function HomePage() {
  return (
    <div className="homepage-container">
      <h1>HomePage</h1>
      <p>Welcome to CineMatch...</p>
      <Navbar />
    </div>
  );
}

export default HomePage;