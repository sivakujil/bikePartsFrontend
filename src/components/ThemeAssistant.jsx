import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const { user: userData, token } = response.data;

      if (!userData || !token) {
        throw new Error("Invalid server response");
      }

      // Save token and user to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update context
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      // Clear any existing invalid data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw error;
    }
  };

  const googleLogin = async (code) => {
    try {
      const response = await api.post("/oauth/google", { code });
      const { user: userData, token } = response.data;

      if (!userData || !token) {
        throw new Error("Invalid server response");
      }

      // Save token and user to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update context
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Google login failed:", error);
      // Clear any existing invalid data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw error;
    }
  };

  const facebookLogin = async (code) => {
    try {
      const response = await api.post("/oauth/facebook", { code });
      const { user: userData, token } = response.data;

      if (!userData || !token) {
        throw new Error("Invalid server response");
      }

      // Save token and user to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Update context
      setUser(userData);

      return userData;
    } catch (error) {
      console.error("Facebook login failed:", error);
      // Clear any existing invalid data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");

      if (storedUser && token) {
        try {
          const response = await api.get("/auth/me");
          setUser(response.data);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, googleLogin, facebookLogin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// **Add this helper hook**
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
