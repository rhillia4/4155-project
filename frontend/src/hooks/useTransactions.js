import { getTransactionsAPI, createTransactionAPI } from "../services/api";

export const useTransactions = () => {
  const getTransactions = async (portfolioId) => {
    try {
      const res = await getTransactionsAPI(portfolioId);
      return res.data || []; // ✅ RETURN
    } catch (err) {
      if (err.response?.status === 404) {
        return [];
      } else {
        console.error("Error fetching transactions:", err);
        throw err;
      }
    }
  };

  const createTransaction = async (portfolioId, transactionData) => {
    try {
      const res = await createTransactionAPI(portfolioId, transactionData);
      return res.data; // ✅ RETURN
    } catch (err) {
      console.error("Backend validation error:", err.response?.data);
      throw err;
    }
  };

  return {
    getTransactions,
    createTransaction,
  };
};