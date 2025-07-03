import { createContext, useContext, useState, useEffect } from "react";

// Create the user context
const UserContext = createContext();

// Provider to wrap your app and expose user state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage (initial hydration only)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login and save full user data
  const login = (userData) => {
    console.log("Updating user context with:", userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout and clear data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Update user data partially (e.g., after profile update)
  const updateUser = (userData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

// Hook to use updateUser function specifically
export const useUpdateUser = () => {
  const { updateUser } = useContext(UserContext);
  if (!updateUser)
    throw new Error("useUpdateUser must be used within a UserProvider");
  return updateUser;
};
