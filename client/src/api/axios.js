import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const api = axios.create({
  baseURL: configuredApiUrl || (isLocalhost ? "http://localhost:5000/api" : "/api")
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("populens-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
