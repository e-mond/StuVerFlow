import api from "./index";
import { setUserToken } from "../utils/authUtils"; // Removed getUserToken import

/**
 * Login with credentials
 */
export const login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");

  try {
    const response = await api.post("user_login/", { email, password }); // Relative path
    const user = {
      id: response.data.id,
      name: response.data.name,
      handle: response.data.data.handle || response.data.id,
      token: response.data.token,
    };
    setUserToken(user.token);
    return user;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data || error; // Re-throw with server response if available
  }
};

/**
 * Register new user
 */
export const signup = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  try {
    const response = await api.post("signup/", { email, password, name }); // Relative path
    const user = {
      id: response.data.id,
      name: response.data.name,
      handle: response.data.data.handle || response.data.id,
      token: response.data.token,
    };
    setUserToken(user.token);
    return user;
  } catch (error) {
    console.error("Signup error:", error.response?.data || error.message);
    throw error.response?.data || error; // Re-throw with server response if available
  }
};

/**
 * Request a password reset email
 */
export const requestPasswordReset = async (email) => {
  if (!email) throw new Error("Email is required");

  try {
    const response = await api.post("auth/reset-password/request/", { email }); // Relative path
    return { message: response.data.message || "Password reset email sent" };
  } catch (error) {
    console.error(
      "Password reset request error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error; // Re-throw with server response if available
  }
};

/**
 * Reset a user's password with a token
 */
export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword)
    throw new Error("Token and new password are required");

  try {
    const response = await api.post("auth/reset-password/", {
      token,
      newPassword,
    }); // Relative path
    return { message: response.data.message || "Password reset successfully" };
  } catch (error) {
    console.error(
      "Password reset error:",
      error.response?.data || error.message,
    );
    throw error.response?.data || error; // Re-throw with server response if available
  }
};

/**
 * Log out the current user
 */
export const logout = async () => {
  try {
    const response = await api.post("logout/", {}); // Relative path
    setUserToken(""); // Reset token
    return { message: response.data.message || "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error.response?.data || error; // Re-throw with server response if available
  }
};
