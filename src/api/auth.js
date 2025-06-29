import api from "./index";

// Logs in a user
export const login = async (email, password) => {
  try {
    if (!email || !password) throw new Error("Email and password are required");
    const response = await api.post(
      "/auth/login/",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return {
      id: response.data.id || "",
      name: response.data.name || "",
      handle: response.data.handle || "",
      token: response.data.token || "",
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to login" };
  }
};

// Signs up a new user
export const signup = async (userData) => {
  try {
    if (!userData.email || !userData.password || !userData.name) {
      throw new Error("Email, password, and name are required");
    }
    const response = await api.post("/auth/signup/", userData, {
      headers: { "Content-Type": "application/json" },
    });
    return {
      id: response.data.id || "",
      name: response.data.name || userData.name,
      handle: response.data.handle || "",
      token: response.data.token || "",
    };
  } catch (error) {
    throw error.response?.data || { message: "Failed to signup" };
  }
};

// Requests a password reset
export const requestPasswordReset = async (email) => {
  try {
    if (!email) throw new Error("Email is required");
    const response = await api.post(
      "/auth/reset-password/request/",
      { email },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return { message: response.data.message || "Password reset email sent" };
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to request password reset" }
    );
  }
};

// Resets a user's password
export const resetPassword = async (token, newPassword) => {
  try {
    if (!token || !newPassword)
      throw new Error("Token and new password are required");
    const response = await api.post(
      "/auth/reset-password/",
      { token, newPassword },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return { message: response.data.message || "Password reset successfully" };
  } catch (error) {
    throw error.response?.data || { message: "Failed to reset password" };
  }
};

// Logs out a user
export const logout = async () => {
  try {
    await api.post(
      "/auth/logout/",
      {},
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return { message: "Logged out successfully" };
  } catch (error) {
    throw error.response?.data || { message: "Failed to logout" };
  }
};
