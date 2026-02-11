import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

import DashboardPage from "./pages/DashboardPage.jsx";
import { PortfolioProvider } from "./context/portfolioContext.jsx";

// import GamePage from "./pages/GamePage.jsx";
// import GameLobbyPage from "./pages/GameLobbyPage.jsx";
// import LeaderboardPage from "./pages/LeaderboardPage.jsx";

import PortfolioPage from "./pages/PortfolioPage.jsx";

// import TradePage from "./pages/TradePage.jsx";
// import TransactionsPage from "./pages/TransactionsPage.jsx";

// import SettingsPage from "./pages/SettingsPage.jsx";


function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
