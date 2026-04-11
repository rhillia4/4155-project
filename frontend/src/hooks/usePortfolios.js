import { useState } from "react";
import { getPortfolioList } from "../services/api";

export const usePortfolios = () => {

  const fetchPortfolios = async () => {
    const res = await getPortfolioList();

    return res.data;
  };

  return { fetchPortfolios };
};