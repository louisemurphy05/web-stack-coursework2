/* 
 * This component sets up the routing configuration for the entire client application.
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import RecommendationsPage from "./pages/RecommendationsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

         {/* Main Application Routes (Requires Authentication) */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;