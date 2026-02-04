
// http://localhost:4000/api/v1

// https://my-e-shop-mern.onrender.com/api/v1

import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
instance.interceptors.request.use(
  (config) => {
    // Inject Content-Type if not present
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Inject Authorization token if exists
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// RESPONSE INTERCEPTOR (optional)
// ===============================
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on token expiry (optional)
    if (error.response?.status === 401) {
      localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
