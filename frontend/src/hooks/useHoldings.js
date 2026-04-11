import { useState } from "react";
import { getHoldingsAPI, getStockData } from "../services/api";

export const useHoldings = () => {
  const [holdings, setHoldings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getHoldings = async (portfolioId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getHoldingsAPI(portfolioId);
      for (const holding of res.data) {
        try {
          const stockRes = await getStockData(holding.asset_symbol);
          holding.latest_price = stockRes.data[0]?.price;
          holding.value = stockRes.data[0]?.price * holding.remaining_shares;
        } catch (err) {
          console.error(`Error fetching stock data for ${holding.asset_symbol}:`, err);
        }
      }


      setHoldings(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setHoldings([]);
        setError("No holdings found for this portfolio");
      } else {
        console.error("Error fetching holdings:", err);
        setError("Failed to load holdings");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    getHoldings,
    holdings,
    loading,
    error,
  };
};
