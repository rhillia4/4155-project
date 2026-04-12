import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getBudgetProfile,
  updateBudgetProfile,
  getBudgetTransactions,
  createBudgetTransaction,
  updateBudgetTransaction,
  deleteBudgetTransaction,
} from "../services/api";

const BudgetContext = createContext();

const standardPercentages = {
  Housing: 30,
  Transportation: 15,
  Insurance: 15,
  Utilities: 12.5,
  Food: 15,
  Other: 12.5,
  Income: 0,
};

function computeLimits(income) {
  if (!income || Number(income) <= 0) return null;
  const limits = {};
  Object.keys(standardPercentages).forEach((cat) => {
    limits[cat] = parseFloat(
      ((Number(income) * standardPercentages[cat]) / 100).toFixed(2)
    );
  });
  return limits;
}

function dbToFrontend(t) {
  return {
    id: t.id,
    date: t.date,
    item: t.item,
    category: t.category,
    amount: parseFloat(t.amount),
  };
}

export function BudgetProvider({ children }) {
  const { isAuthenticated } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [monthlyIncome, setMonthlyIncomeState] = useState("");
  const [budgetLimits, setBudgetLimits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const [profileRes, txRes] = await Promise.all([
          getBudgetProfile(),
          getBudgetTransactions(),
        ]);

        const income = profileRes.data.monthly_income;
        setMonthlyIncomeState(income ? String(income) : "");
        setBudgetLimits(Number(income) > 0 ? computeLimits(income) : null);
        setTransactions(txRes.data.map(dbToFrontend));
      } catch (err) {
        console.error("Failed to load budget data:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isAuthenticated]);

  const setMonthlyIncome = useCallback(async (value) => {
    setMonthlyIncomeState(value);
    if (!isAuthenticated) return;
    try {
      await updateBudgetProfile({ monthly_income: value });
    } catch (err) {
      console.error("Failed to save monthly income:", err);
    }
  }, [isAuthenticated]);

  const createBudget = useCallback(async (income) => {
    const limits = computeLimits(income);
    setBudgetLimits(limits);
    setMonthlyIncomeState(String(income));
    try {
      await updateBudgetProfile({ monthly_income: income });
      const existing = await getBudgetTransactions();
      await Promise.all(existing.data.map((t) => deleteBudgetTransaction(t.id)));
      setTransactions([]);
    } catch (err) {
      console.error("Failed to create budget:", err);
    }
  }, []);

  const addTransaction = useCallback(async (draft) => {
    try {
      const res = await createBudgetTransaction(draft);
      setTransactions((prev) => [dbToFrontend(res.data), ...prev]);
    } catch (err) {
      console.error("Failed to create transaction:", err);
      throw err;
    }
  }, []);

  const editTransaction = useCallback(async (id, draft) => {
    try {
      const res = await updateBudgetTransaction(id, draft);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? dbToFrontend(res.data) : t))
      );
    } catch (err) {
      console.error("Failed to update transaction:", err);
      throw err;
    }
  }, []);

  const removeTransaction = useCallback(async (id) => {
    try {
      await deleteBudgetTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      throw err;
    }
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        budgetLimits,
        setBudgetLimits,
        monthlyIncome,
        setMonthlyIncome,
        createBudget,
        addTransaction,
        editTransaction,
        removeTransaction,
        loading,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);