import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

const googleCallback = async (code) => {
  const response = await api.post("/auth/google/callback", { code });
  return response.data;
};

export { login, register, changePassword, getProfile, googleCallback };
