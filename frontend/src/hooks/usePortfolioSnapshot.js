// hooks/usePortfolio.js
import { getPortfolioSnapshots } from "../services/api";

export const usePortfolioSnapshots = () => {
  const getPortfolioSnapshotDetails = async (id) => {
    if (!id) return;
    const res = await getPortfolioSnapshots(id);
    return res.data;
  };

  return { getPortfolioSnapshotDetails };
};