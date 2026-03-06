import React from "react";
import { Box, Typography } from "@mui/material";
import BudgetPieChart from "../components/charts/BudgetPieChart.jsx";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const categories = ["Housing", "Utilities", "Transportation", "Insurance", "Food", "Savings", "Other"];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFD", "#FF6B6B", "#8884D8"];

function DashboardPage({ transactions = [], budgetLimits = {}, monthlyIncome = 0 }) {
  // Compute spent per category
  const categorySpent = {};
  categories.forEach((cat) => {
    categorySpent[cat] = transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
  });

  // Category Limits data for horizontal bar chart
  const barData = categories.map((cat) => ({
    category: cat,
    spent: categorySpent[cat],
    limit: budgetLimits ? budgetLimits[cat] || 0 : 0,
  }));

  return (
    <Box sx={{ p: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
      
      {/* Left Column */}
      <Box sx={{ flex: 1, minWidth: 400, display: "flex", flexDirection: "column", gap: 4 }}>
        
        {/* Budget Pie Chart */}
        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Spending Breakdown
          </Typography>
          <BudgetPieChart budget={{ transactions }} />
        </Box>

        {/* Category Limits Horizontal Bar Chart */}
        <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Category Limits
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={barData.map((d) => ({
                ...d,
                underLimit: Math.min(d.spent, d.limit),
                overLimit: d.spent > d.limit ? d.spent - d.limit : 0,
              }))}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" />
              <Tooltip />
              {/* Green portion (under the limit) */}
              <Bar dataKey="underLimit" stackId="a" fill="#82ca9d" maxBarSize={20} />
              {/* Red portion (overspend) */}
              <Bar dataKey="overLimit" stackId="a" fill="#FF4136" maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

      </Box>

      {/* Right Column: can add more charts or summary info later */}
      <Box sx={{ flex: 1, minWidth: 400 }}>
        {/* Placeholder or additional info */}
      </Box>
    </Box>
  );
}

export default DashboardPage;