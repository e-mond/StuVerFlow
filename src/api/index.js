import axios from "axios";
import { getUserToken } from "../utils/authUtils";

// Create Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  timeout: 10000,
});

// Automatically attach token if available
api.interceptors.request.use(
  (config) => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "📡 Authenticated Request:",
        config.method,
        config.url,
        "Token:",
        token,
      );
    } else {
      console.warn("⚠️ Request without token:", config.method, config.url);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle responses globally
api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ Response:",
      response.config.method,
      response.config.url,
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
      "Status:",
      res?.status,
      "Data:",
      res?.data || error.message,
    );
    return Promise.reject(res?.data || { message: "API Error" });
  },
);

export default api;
