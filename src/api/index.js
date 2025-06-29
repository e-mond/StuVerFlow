import axios from "axios";

// Creates an Axios instance configured for API requests to the Django backend
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Base URL for Django backend API endpoints
  headers: {
    "Content-Type": "multipart/form-data", // Supports file uploads (e.g., images)
  },
});

// Adds request interceptor to include authentication token from local storage
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieves user data
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // Adds token to headers
    }
    return config;
  },
  (error) => Promise.reject(error), // Handles request errors
);

export default api;
