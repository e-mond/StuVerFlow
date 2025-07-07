import { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired, clearUserToken } from "../utils/authUtils";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // prevent flash on load

  // On app load: check token and session expiry
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (!isTokenExpired()) {
        setUser(parsed);
      } else {
        logout(); // expired token
      }
    }

    setLoading(false); // only once
  }, []);

  // Every 1 minute: check for session expiry
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logout();
      }
    }, 60 * 1000); // every 1 min

    return () => clearInterval(interval);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const issuedAt = new Date().getTime();
    localStorage.setItem("token_issued_at", issuedAt.toString());
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearUserToken();
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const useUpdateUser = () => {
  const { updateUser } = useUser();
  return updateUser;
};
