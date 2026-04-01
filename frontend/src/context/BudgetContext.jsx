import React, { createContext, useContext, useState } from "react";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");

  return (
    <BudgetContext.Provider
      value={{
        transactions,
        setTransactions,
        budgetLimits,
        setBudgetLimits,
        monthlyIncome,
        setMonthlyIncome,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => useContext(BudgetContext);