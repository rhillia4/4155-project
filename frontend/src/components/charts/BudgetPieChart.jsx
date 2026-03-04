import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFD", "#FF6B6B", "#8884D8"];

const categories = ["Housing", "Utilities", "Transportation", "Insurance", "Food", "Savings", "Other"];

function BudgetPieChart({ budget }) {
  if (!budget) return null;

  const data = categories.map((cat) => ({
    name: cat,
    value: budget.transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default BudgetPieChart;