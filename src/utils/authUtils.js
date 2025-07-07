/**
 * Save user token and store timestamp for session expiration tracking.
 *
 * @param {string} token - JWT token received after login.
 */
export const setUserToken = (token) => {
  try {
    // Get existing user data or initialize empty
    const user = JSON.parse(localStorage.getItem("user")) || {};

    // Store updated user data with token
    localStorage.setItem("user", JSON.stringify({ ...user, token }));

    // Store the timestamp when the token was issued
    const issuedAt = new Date().getTime(); // in milliseconds
    localStorage.setItem("token_issued_at", issuedAt.toString());
  } catch {
    // Fallback if JSON parsing fails
    localStorage.setItem("user", JSON.stringify({ token }));
  }
};

/**
 * Get the current JWT token from localStorage.
 *
 * @returns {string} The stored token or empty string if not found.
 */
export const getUserToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || "";
  } catch {
    return "";
  }
};

/**
 * Check if the stored token has expired based on timestamp.
 *
 * @returns {boolean} True if expired, false if still valid.
 */
export const isTokenExpired = () => {
  const issuedAt = parseInt(localStorage.getItem("token_issued_at"), 10);

  if (!issuedAt) return true;

  const now = new Date().getTime();
  const sessionDuration = 30 * 60 * 1000; // 30 minutes (in milliseconds)

  return now - issuedAt > sessionDuration;
};

/**
 * Clear token-related data from localStorage (for logout or session timeout).
 */
export const clearUserToken = () => {
  localStorage.removeItem("token_issued_at");
  // You may also want to remove the entire user if preferred:
  localStorage.removeItem("user");
};
