import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401 or 403 globally here
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Unauthorized! Redirect to login or refresh token.");
      // e.g., window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
