import { useState } from "react";
import { getHoldingsAPI, getStockData } from "../services/api";

export const useHoldings = () => {
  const getHoldings = async (portfolioId) => {
    try {
      const res = await getHoldingsAPI(portfolioId);

      const enriched = await Promise.all(
        res.data.map(async (holding) => {
          try {
            const stockRes = await getStockData(holding.asset.symbol);
            const price = stockRes.data[0]?.price;

            return {
              ...holding,
              latest_price: price,
              value: price * holding.remaining_shares,
            };
          } catch (err) {
            console.error(
              `Error fetching stock data for ${holding.asset.symbol}:`,
              err
            );
            return holding;
          }
        })
      );

      return enriched; // ✅ THIS FIXES YOUR ISSUE
    } catch (err) {
      if (err.response?.status === 404) {
        return []; // ✅ safe fallback
      } else {
        console.error("Error fetching holdings:", err);
        throw err; // let caller handle it
      }
    }
  };

  return { getHoldings };
};