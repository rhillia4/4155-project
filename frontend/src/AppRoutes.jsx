import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";

function AppRoutes() {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState(null);

  return (
    <Routes>

      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

          {/* Budget */}
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