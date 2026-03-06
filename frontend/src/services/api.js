// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL + "/api",
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
  });

// Token Refresh / Errors

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


// Auth

export const login = (data) =>
  api.post("/token/", data);

export const register = (data) =>
  api.post("/register/", data);

export const fetchUser = () =>
  api.get("/user/");

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



