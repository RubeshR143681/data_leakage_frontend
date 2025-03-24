import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token }); // Set the user state with the token
    }
  }, []);

  // Login function to set the user and store the token
  const login = (token) => {
    localStorage.setItem("token", token); // Store the token in localStorage
    setUser({ token }); // Update the user state
  };

  // Logout function to clear the user and remove the token
  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setUser(null); // Clear the user state
  };

  // Create an axios instance with the token in the headers
  const authAxios = axios.create({
    baseURL: "http://localhost:5000", // Base URL for the backend
    headers: {
      Authorization: user?.token, // Include the token in the headers
    },
  });

  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
