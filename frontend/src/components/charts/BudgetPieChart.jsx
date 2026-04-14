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
      fontSize="12"
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
      value: (budget.transactions || [])
        .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    }))
    .filter((entry) => entry.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const entry = payload[0];
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          px: 1.5,
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {entry.name}
        </Typography>
        <Typography
          sx={{ fontSize: "0.82rem", color: theme.palette.text.secondary }}
        >
          ${Number(entry.value).toFixed(2)}
        </Typography>
      </Box>
    );
  };

  if (data.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ color: theme.palette.text.secondary, opacity: 0.7 }}>
          No spending data yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        // KEY FIX: use a fixed minHeight instead of height: "100%"
        // This gives Recharts a real pixel size to work with at any screen size
        minHeight: 260,
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      {/* Chart */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          // KEY FIX: was minHeight: 0 (which allowed full collapse) — now 260px floor
          minHeight: 260,
        }}
      >
        {/* KEY FIX: give ResponsiveContainer a real pixel height, not "100%"
            "100%" only works when the parent has an explicit pixel height, which
            flex containers often don't provide. 260px always works. */}
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius="55%"
              cx="40%"
              cy="50%"
              label={renderLabel}
              labelLine={false}
              stroke={theme.palette.background.paper}
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
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          pr: 1,
        }}
      >
        {data.map((entry) => (
          <Box
            key={entry.name}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "2px",
                backgroundColor: CATEGORY_COLORS[entry.name],
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.8rem",
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
  );
}

export default BudgetPieChart;
