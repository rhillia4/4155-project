import { useState } from "react";
import { getTransactionsAPI, createTransactionAPI } from "../services/api";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTransactions = async (portfolioId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getTransactionsAPI(portfolioId);
      setTransactions(res.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setTransactions([]);
        setError("No transactions found for this portfolio");
      } else {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions");
      }
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (portfolioId, transactionData) => {
    try {
      const res = await createTransactionAPI(portfolioId, transactionData);
      setTransactions((prev) => [...prev, res.data]);
    } catch (err) {
        console.error("Backend validation error:", err.response?.data);
        throw err;
    }
  };

  return {
    transactions,
    loading,
    error,
    getTransactions,
    createTransaction,
  };
};
