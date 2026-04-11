import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MoviePage from "./pages/MoviePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
// import ReviewPage from "./pages/ReviewPage";
// import RecommendationPage from "./pages/RecommendationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* <Route path="/reviews" element={<ReviewPage />} /> */}
        {/* <Route path="/recommendations" element={<RecommendationPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;