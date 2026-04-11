// hooks/usePortfolio.js
import { useState } from "react";
import { getPortfolioSnapshots } from "../services/api";

export const usePortfolioSnapshots = (id) => {
  const [snapshots, setPortfolioSnapshots] = useState(null);

  const getPortfolioSnapshotDetails = async () => {
    const res = await getPortfolioSnapshots(id);
    setPortfolioSnapshots(res.data);
  };

  return { snapshots, getPortfolioSnapshotDetails };
};

export default usePortfolioSnapshots;