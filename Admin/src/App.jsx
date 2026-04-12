// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import AdminLoginPage from "./pages/adminLoginPage";
// import DashboardPage from "./pages/dashboardPage";
// import UsersPage from "./pages/userPage";
// import MoviesPage from "./pages/moviesPage";
// import ReviewsPage from "./pages/reviewsPage";
// import { getAuthToken } from "./api/authApi";
// import "./App.css";

// // Protected route wrapper
// const ProtectedRoute = ({ children }) => {
//   const token = getAuthToken();
//   if (!token) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<AdminLoginPage />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <DashboardPage />
//           </ProtectedRoute>
//         } />
//         <Route path="/users" element={
//           <ProtectedRoute>
//             <UsersPage />
//           </ProtectedRoute>
//         } />
//         <Route path="/movies" element={
//           <ProtectedRoute>
//             <MoviesPage />
//           </ProtectedRoute>
//         } />
//         <Route path="/reviews" element={
//           <ProtectedRoute>
//             <ReviewsPage />
//           </ProtectedRoute>
//         } />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLoginPage from "./pages/adminLoginPage";
import DashboardPage from "./pages/dashboardPage";
import UsersPage from "./pages/userPage";
import MoviesPage from "./pages/moviesPage";
import ReviewsPage from "./pages/reviewsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;