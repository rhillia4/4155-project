import { useState } from "react";

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);

  const fetchBudgets = () => {
    setBudgets([
      {
        id: 1,
        name: "Groceries",
        limit: 500,
        spent: 0,
        transactions: [],
      },
    ]);
  };

  const addBudget = (budget) => {
    setBudgets((prev) => [...prev, { ...budget, id: Date.now(), spent: 0, transactions: [] }]);
  };

  const addTransaction = (budgetId, transaction) => {
    setBudgets((prev) =>
      prev.map((b) => {
        if (b.id === budgetId) {
          const updatedTransactions = [...b.transactions, { ...transaction, id: Date.now() }];
          const spent = updatedTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { ...b, transactions: updatedTransactions, spent };
        }
        return b;
      })
    );
  };

  return { budgets, fetchBudgets, addBudget, addTransaction };
}