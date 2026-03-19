import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

const CATEGORY_COLORS = {
  Housing: "#C9B8D4",
  Transportation: "#A8BFC9",
  Insurance: "#D8B4A0",
  Food: "#B7C4A3",
  Utilities: "#E6CBA8",
  Other: "#DCCFC1",
  Savings: "#C4A484",
};

const orderedCategories = [
  "Housing",
  "Transportation",
  "Insurance",
  "Food",
  "Utilities",
  "Other",
  "Savings",
];

const RADIAN = Math.PI / 180;

function renderLabel(props) {
  const { cx, cy, midAngle, outerRadius, percent, value } = props;

  if (!value || value <= 0) return null;

  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#6F5A45"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="16"
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function BudgetPieChart({ budget }) {
  const theme = useTheme();

  if (!budget) return null;

  const data = orderedCategories
    .map((cat) => ({
      name: cat,
      value: budget.transactions
        .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    }))
    .filter((entry) => entry.value > 0);

  return (
    <Box sx={{ width: "100%", height: 380 }}>
      <ResponsiveContainer width="100%" height={285}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            cy="56%"
            label={renderLabel}
            labelLine={false}
            stroke="#F4F1EC"
            strokeWidth={2}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={650}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={CATEGORY_COLORS[entry.name] || "#DCCFC1"}
                fillOpacity={0.92}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
        </PieChart>
      </ResponsiveContainer>

      <Box
        sx={{
          mt: 2.5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, auto)",
            rowGap: 1.2,
            columnGap: 2.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.map((entry) => (
            <Box
              key={entry.name}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 0.5,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "2px",
                  backgroundColor: CATEGORY_COLORS[entry.name],
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default BudgetPieChart;