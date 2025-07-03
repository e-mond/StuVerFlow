import { createContext, useContext, useState, useEffect } from "react";

// Create the User context
const UserContext = createContext();

// User provider component to manage user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  // Login function to update user state and localStorage
  const contextLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function to clear user state and localStorage
  const contextLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Sync with localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Provide the context value
  return (
    <UserContext.Provider
      value={{ user, login: contextLogin, logout: contextLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the User context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
