// Importing necessary React hooks for context creation and state management
import { createContext, useState, useEffect } from "react";

// Creating the UserContext for sharing user state across components
const UserContext = createContext();

// Component to provide user context to the app
export const UserProvider = ({ children }) => {
  // State to hold the current user data
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in a user and update localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to log out a user and clear localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Providing user state and auth functions to child components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Exporting the UserContext for use in the useUser hook
export { UserContext };
