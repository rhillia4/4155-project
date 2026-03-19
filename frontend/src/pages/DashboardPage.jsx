import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useBudget } from "../context/BudgetContext";
import BudgetPieChart from "../components/charts/BudgetPieChart.jsx";
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
  const theme = useTheme();

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
    p: 3,
    background: "linear-gradient(145deg, #ffffff, #f8f3ee)",
    boxShadow: "0 8px 20px rgba(111, 90, 69, 0.08)",
    border: "1px solid rgba(111, 90, 69, 0.12)",
  };

  return (
    <Box sx={{ p: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
      {/* LEFT SIDE */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 420 }}>
        <Box sx={cardStyle}>
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Spending Breakdown
          </Typography>
          <BudgetPieChart budget={{ transactions }} />
        </Box>

        <Box sx={cardStyle}>
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary }}
          >
            Category Limits
          </Typography>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart layout="vertical" data={barData} margin={{ top: 8, right: 18, left: 12, bottom: 8 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(111, 90, 69, 0.12)"
              />
              <XAxis type="number" stroke={theme.palette.text.secondary} />
              <YAxis
                type="category"
                dataKey="category"
                width={120}
                stroke={theme.palette.text.primary}
                tickFormatter={(v) => (v.length > 9 ? `${v.slice(0, 9)}…` : v)}
              />
              <Tooltip />
              <Bar dataKey="under" stackId="a" fill="#8EAE7A" radius={[0, 4, 4, 0]} />
              <Bar dataKey="over" stackId="a" fill="#B65A4E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ flex: 1, minWidth: 420, ...cardStyle }}>
        <Typography
          align="center"
          variant="h6"
          gutterBottom
          sx={{ color: theme.palette.text.primary }}
        >
          Portfolio Overview
        </Typography>

        {/* RESERVED AREA FOR PORTFOLIO IMPLEMENTATION */}
      </Box>
    </Box>
  );
}

export default DashboardPage;