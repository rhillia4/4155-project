// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// JWT + Mode

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    const mode = localStorage.getItem("mode") || "real";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach mode globally
    config.headers["X-Portfolio-Mode"] = mode;

    return config;
  },
  (error) => Promise.reject(error)
);

// Token Refresh / Errors

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Optional: auto logout or refresh token
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


// Auth

export const login = (data) =>
  api.post("/auth/login/", data);

export const register = (data) =>
  api.post("/auth/register/", data);

export const logout = () =>
  api.post("/auth/logout/");

// Portfolio
export const getPortfolioList = () =>
  api.get("/portfolios/");

export const getPortfolioDetailsAPI = (id) =>
  api.get(`/portfolios/${id}/`);

export const createPortfolioAPI = (data) =>
  api.post("/portfolios/", data);

export const updatePortfolioAPI = (id, data) =>
  api.put(`/portfolios/${id}/`, data);

export const deletePortfolioAPI = (id) =>
  api.delete(`/portfolios/${id}/`);

export const getHoldings = () =>
  api.get("/holdings/");

export const getTransactionsAPI = (id) =>
  api.get(`/portfolios/${id}/transactions/`);
    

export const createTransactionAPI = (id, data) =>
  api.post(`/portfolios/${id}/transactions/`, data);


// Game

export const getLeaderboard = () =>
  api.get("/game/leaderboard/");

export const startGame = () =>
  api.post("/game/start/");

export const getGameState = () =>
  api.get("/game/state/");



