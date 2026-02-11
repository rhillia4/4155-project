import { useState } from "react";
import { getPortfolioList } from "../services/api";

export const usePortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);

  const fetchPortfolios = async () => {
    const res = await getPortfolioList();
    setPortfolios(res.data);
  };

  return { portfolios, fetchPortfolios };
};