import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

import BudgetPage from "./pages/BudgetPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

function AppRoutes() {
  // Persist monthlyIncome across pages
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState(null);

  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          {/* Redirect "/" to "/budget" */}
          <Route path="/" element={<Navigate to="/budget" replace />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                transactions={transactions}
                budgetLimits={budgetLimits}
                monthlyIncome={monthlyIncome}
              />
            }
          />

          {/* Budget Page */}
          <Route
            path="/budget"
            element={
              <BudgetPage
                transactions={transactions}
                setTransactions={setTransactions}
                budgetLimits={budgetLimits}
                setBudgetLimits={setBudgetLimits}
                monthlyIncome={monthlyIncome}
                setMonthlyIncome={setMonthlyIncome}
              />
            }
          />

          {/* Portfolio */}
          <Route path="/portfolio" element={<PortfolioPage />} />
          
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;