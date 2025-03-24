import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";

// Main App Component
function App() {
  const location = useLocation();

  // Define routes where header and footer should not be shown
  const hideHeaderFooterRoutes = ["/login", "/register"];

  // Check if the current route is in the hideHeaderFooterRoutes array
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-cyan-200 via-blue-400 to-indigo-600">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Conditionally render Header */}
      {!shouldHideHeaderFooter && <Header />}

      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-cyan-100 via-blue-300 to-indigo-400">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Conditionally render Footer */}
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
}

// Wrap App with Router and AuthProvider
function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;
