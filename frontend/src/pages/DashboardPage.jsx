import React, { useEffect } from "react";import { Box, Typography, useTheme } from "@mui/material";
import { useBudget } from "../context/BudgetContext";
import BudgetPieChart from "../components/charts/BudgetPieChart.jsx";
import StockIncomeGraph from "../components/portfolio/StockIncomeGraph.jsx";
import PortfolioComposition from "../components/portfolio/PortfolioComposition.jsx";
import { usePortfolioContext } from '../context/PortfolioContext.jsx';
import { useHoldings } from '../hooks/useHoldings.js';
import { usePortfolioSnapshots } from '../hooks/usePortfolioSnapshot.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
 
const categories = [
  "Housing",
  "Transportation",
  "Insurance",
  "Food",
  "Utilities",
  "Other",
  "Savings",
];
 
function DashboardPage() {
  const { transactions, budgetLimits } = useBudget();
  const { portfolio } = usePortfolioContext();
  const { holdings = [], getHoldings } = useHoldings();
  const { snapshots = [], getPortfolioSnapshotDetails } = usePortfolioSnapshots(portfolio?.id);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  
  useEffect(() => {
    if (portfolio?.id) {
      getHoldings(portfolio.id);
      getPortfolioSnapshotDetails(portfolio.id);
    }
  }, [portfolio?.id]);
 
  if (!budgetLimits) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
          No budget found. Please create one first.
        </Typography>
      </Box>
    );
  }
 
  const categorySpent = {};
  categories.forEach((cat) => {
    categorySpent[cat] = transactions
      .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  });
 
  const barData = categories.map((cat) => {
    const spent = categorySpent[cat] || 0;
    const limit = budgetLimits?.[cat] || 0;
    return {
      category: cat,
      under: Math.min(spent, limit),
      over: spent > limit ? spent - limit : 0,
    };
  });
 
  const cardStyle = {
    borderRadius: 3,
    p: 2,
    background: isDark
      ? `linear-gradient(145deg, ${theme.palette.background.paper}, #221C17)`
      : "linear-gradient(145deg, #ffffff, #f8f3ee)",
    boxShadow: isDark
      ? "0 8px 20px rgba(0, 0, 0, 0.3)"
      : "0 8px 20px rgba(111, 90, 69, 0.08)",
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.14)"
      : "1px solid rgba(111, 90, 69, 0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };
 
  const gridStroke = isDark
    ? "rgba(168, 134, 94, 0.12)"
    : "rgba(111, 90, 69, 0.12)";
 
  const barUnderFill = isDark ? "#7FB187" : "#8EAE7A";
  const barOverFill = isDark ? "#D47A70" : "#B65A4E";
 
  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        gap: 2,
        height: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Spending Breakdown */}
        <Box sx={{ ...cardStyle, flex: 1 }}>
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
          >
            Spending Breakdown
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <BudgetPieChart budget={{ transactions }} />
          </Box>
        </Box>
 
        {/* Category Limits */}
        <Box sx={{ ...cardStyle, flex: 1 }}>
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
          >
            Category Limits
          </Typography>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 4, right: 16, left: 16, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                  type="number"
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={120}
                  stroke={theme.palette.text.secondary}
                  tick={{ fill: theme.palette.text.primary, fontSize: 11 }}
                  tickFormatter={(v) => (v.length > 9 ? `${v.slice(0, 9)}…` : v)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                  }}
                  labelStyle={{ color: theme.palette.text.primary }}
                  itemStyle={{ color: theme.palette.text.secondary }}
                />
                <Bar dataKey="under" stackId="a" fill={barUnderFill} radius={[0, 4, 4, 0]} />
                <Bar dataKey="over" stackId="a" fill={barOverFill} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
 
      {/* RIGHT SIDE */}
      <Box sx={{ ...cardStyle, flex: 1, minWidth: 0 }}>
        <Typography
          align="center"
          variant="h6"
          gutterBottom
          sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
        >
          Portfolio Overview
        </Typography>
 
        {/* RESERVED AREA FOR PORTFOLIO IMPLEMENTATION */}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* The exactly-the-same charts */}
            <StockIncomeGraph snapshots={snapshots} holdings={holdings} />
            <PortfolioComposition holdings={holdings} />
          </Box>
      </Box>
    </Box>
  );
}
 
export default DashboardPage;