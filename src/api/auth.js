import api from "./index";

/**
 * Login with credentials
 */
export const login = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");

  const response = await api.post("/user_login/", { email, password });

  const user = {
    id: response.data.id,
    name: response.data.name,
    handle: response.data.handle || response.data.id,
    token: response.data.token,
  };

  return user;
};

/**
 * Register new user
 */
export const signup = async ({ email, password, name }) => {
  if (!email || !password || !name) {
    throw new Error("Email, password, and name are required");
  }

  const response = await api.post("/signup/", { email, password, name });

  const user = {
    id: response.data.id,
    name: response.data.name || name,
    handle: response.data.handle || response.data.id,
    token: response.data.token,
  };

  return user;
};

/**
 * Request a password reset email
 */
export const requestPasswordReset = async (email) => {
  if (!email) throw new Error("Email is required");

  const response = await api.post("/auth/reset-password/request/", { email });
  return { message: response.data.message || "Password reset email sent" };
};

/**
 * Reset a user's password with a token
 */
export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword)
    throw new Error("Token and new password are required");

  const response = await api.post("/auth/reset-password/", {
    token,
    newPassword,
  });
  return { message: response.data.message || "Password reset successfully" };
};

/**
 * Log out the current user
 */
export const logout = async () => {
  const response = await api.post("/auth/logout/", {});
  // Optionally clear token from localStorage or context here
  return { message: response.data.message || "Logged out successfully" };
};
