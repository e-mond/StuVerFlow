// Importing necessary React hooks for context usage
import { useContext } from "react";
import { UserContext } from "./UserContext";

// Hook to access the user context in components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
