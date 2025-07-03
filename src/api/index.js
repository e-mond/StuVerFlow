import axios from "axios";
import { getUserToken } from "../utils/authUtils";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/", // Added trailing slash
  timeout: 10000, // 10-second timeout
});

// Automatically attach token if available, excluding login endpoint
api.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    const isLoginRequest =
      config.url === "user_login/" || config.url === "/user_login/"; // Match with or without leading slash
    if (token && !isLoginRequest) {
      config.headers.Authorization = `Token ${token}`; // Use 'Token' scheme
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data"; // Explicitly set for FormData
      }
      console.log(
        "📡 Authenticated Request:",
        config.method,
        config.url,
        "Full URL:",
        config.baseURL + config.url,
        "Token:",
        token,
        "Headers:",
        config.headers,
      );
    } else {
      console.warn(
        "⚠️ Request without token:",
        config.method,
        config.url,
        "Full URL:",
        config.baseURL + config.url,
      );
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data"; // Ensure FormData content type
      } else {
        config.headers["Content-Type"] = "application/json"; // Default to JSON
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses globally with detailed logging
api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Response:",
      response.config.method,
      response.config.url,
      "Full URL:",
      response.config.baseURL + response.config.url,
      response.data,
    );
    return response;
  },
  (error) => {
    const res = error.response;
    console.error(
      "❌ Error:",
      res?.config?.method,
      res?.config?.url,
      "Full URL:",
      res?.config?.baseURL + res?.config?.url,
      "Status:",
      res?.status,
      "Data:",
      res?.data || error.message,
      "Headers Sent:",
      res?.config?.headers,
    );
    return Promise.reject(res?.data || { message: "API Error" });
  },
);

export default api;
