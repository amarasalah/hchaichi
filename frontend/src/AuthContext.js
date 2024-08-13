// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [userImageUrl, setUserImageUrl] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);

  const [userID, setUserID] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          "https://hchaichi-bmqq.vercel.app/protected",
          { withCredentials: true }
        );
        if (response.data.isAuthenticated && response.data.user) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role); // Assuming the role is sent in the response
          setUserEmail(response.data.user.email);

          setUserImageUrl(response.data.user.imageUrl);
          setUserImage(response.data.user.image);
          setUserFirstName(response.data.user.firstName);
          setUserLastName(response.data.user.lastName);

          setUserID(response.data.user.id);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserEmail(null);

          setUserImageUrl(null);
          setUserImage(null);
          setUserFirstName(null);
          setUserLastName(null);

          setUserID(null);
        }
      } catch (error) {
        //console.error("Error checking authentication status", error);
        setIsAuthenticated(false);
        setUserRole(null);
        setUserEmail(null);

        setUserImageUrl(null);
        setUserImage(null);
        setUserFirstName(null);
        setUserLastName(null);
        setUserID(null);
      }
    };

    checkAuthStatus();
  }, []);

  /*   useEffect(() => {
    // Optional: handle side effects or alerts based on authentication status
  }, [isAuthenticated]); */

  const signOut = async () => {
    try {
      await axios.post(
        "https://hchaichi-bmqq.vercel.app/auth/signout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUserRole(null);
      setUserEmail(null);

      setUserImageUrl(null);
      setUserImage(null);
      setUserFirstName(null);
      setUserLastName(null);

      setUserID(null);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };
  const updateUser = (userData) => {
    if (userData) {
      setUserRole(userData.role || userRole);
      setUserEmail(userData.email || userEmail);
      setUserImageUrl(userData.imageUrl || userImageUrl);
      setUserImage(userData.image || userImage);
      setUserFirstName(userData.firstName || userFirstName);
      setUserLastName(userData.lastName || userLastName);
      setUserID(userData._id || userID);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userEmail,
        userImageUrl,
        userImage,
        userFirstName,
        userLastName,
        signOut,
        userID,
        updateUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
