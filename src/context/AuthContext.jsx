// import React, { createContext, useState, useEffect } from "react";
// import api from "../services/api";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Login function
//   const login = async (credentials) => {
//     try {
//       const response = await api.post("/auth/login", credentials);
//       const { user: userData, token } = response.data;

//       if (!userData || !token) {
//         throw new Error("Invalid server response");
//       }

//       // Save token and user to localStorage
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("user", JSON.stringify(userData));

//       // Update context
//       setUser(userData);

//       return userData;
//     } catch (error) {
//       console.error("Login failed:", error);
//       // Clear any existing invalid data
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   // Validate token and load user from localStorage on mount
//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedUser = localStorage.getItem("user");
//       const token = localStorage.getItem("authToken");

//       if (storedUser && token) {
//         try {
//           // Validate the token by making a protected request
//           const response = await api.get("/auth/me");
//           const userData = response.data;
          
//           // Update with fresh user data
//           setUser(userData);
//           localStorage.setItem("user", JSON.stringify(userData));
//         } catch (error) {
//           // Token is invalid, clear storage
//           console.error("Token validation failed:", error);
//           localStorage.removeItem("authToken");
//           localStorage.removeItem("user");
//           setUser(null);
//         }
//       }
      
//       setIsLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };





// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (credentials) => {
    try {
      console.log("Frontend login attempt with credentials:", {
        email: credentials.email,
        passwordProvided: !!credentials.password,
        passwordLength: credentials.password?.length
      });

      const response = await api.post("/auth/login", credentials);
      console.log("Login response:", response.status, response.data);

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
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
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
