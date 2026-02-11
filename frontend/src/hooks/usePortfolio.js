// hooks/usePortfolio.js
import { useState } from "react";
import { getPortfolioDetailsAPI, createPortfolioAPI, updatePortfolioAPI, deletePortfolioAPI } from "../services/api";

export const usePortfolio = (id) => {
  const [portfolio, setPortfolio] = useState(null);

  const getPortfolioDetails = async () => {
    const res = await getPortfolioDetailsAPI(id);
    setPortfolio(res.data);
    console.log("Fetched Portfolio:", res.data);
  };

  const createPortfolio = async (portfolioData) => {
    // Implementation for creating a new portfolio
    const res = await createPortfolioAPI(portfolioData);
    return res.data;
  }

  const updatePortfolio = async (id, portfolioData) => {
    // Implementation for updating an existing portfolio
    const res = await updatePortfolioAPI(id, portfolioData);
    return res.data;
  }

  const deletePortfolio = async (id) => {
    // Implementation for deleting a portfolio
    await deletePortfolioAPI(id);
  }

  return { portfolio, getPortfolioDetails, createPortfolio, updatePortfolio, deletePortfolio };
};
