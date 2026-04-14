import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";
import { useBudget } from "../context/BudgetContext";

const categories = [
  "Housing",
  "Transportation",
  "Insurance",
  "Utilities",
  "Food",
  "Other",
  "Income",
];

const standardPercentages = {
  Housing: 30,
  Transportation: 15,
  Insurance: 15,
  Utilities: 12.5,
  Food: 15,
  Other: 12.5,
  Income: 0,
};

const CATEGORY_COLORS = {
  Housing: "#C9B8D4",
  Transportation: "#A8BFC9",
  Insurance: "#D8B4A0",
  Food: "#B7C4A3",
  Utilities: "#E6CBA8",
  Other: "#DCCFC1",
};

const emptyDraft = {
  id: null,
  date: "",
  item: "",
  category: "Housing",
  amount: "",
};

const CHART_OPTIONS = [
  { key: "donut",     label: "Overview" },
  { key: "bar",       label: "By Category" },
  { key: "breakdown", label: "Breakdown" },
  { key: "daily",     label: "Daily Trend" },
];

const chartTitles = {
  donut:     "Overview",
  bar:       "By Category",
  breakdown: "Spending Breakdown",
  daily:     "Daily Spending Trend",
};

function BudgetPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    transactions,
    budgetLimits,
    setBudgetLimits,
    monthlyIncome,
    setMonthlyIncome,
    createBudget,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useBudget();

  const [activeChart, setActiveChart] = useState("donut");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState({ ...emptyDraft, id: Date.now() });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
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
        {label && (
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: theme.palette.text.primary, mb: 0.5 }}>
            {label}
          </Typography>
        )}
        {payload.map((entry, i) => (
          <Typography key={i} sx={{ fontSize: "0.82rem", color: theme.palette.text.secondary }}>
            {entry.name}: ${Number(entry.value).toFixed(2)}
          </Typography>
        ))}
      </Box>
    );
  };

  const cardStyle = {
    borderRadius: 3,
    p: 3,
    background: isDark
      ? `linear-gradient(145deg, ${theme.palette.background.paper}, #221C17)`
      : "linear-gradient(145deg, #ffffff, #f8f3ee)",
    boxShadow: isDark
      ? "0 8px 20px rgba(0, 0, 0, 0.3)"
      : "0 8px 20px rgba(111, 90, 69, 0.08)",
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.14)"
      : "1px solid rgba(111, 90, 69, 0.12)",
  };

  const miniStatStyle = {
    border: isDark
      ? "2px solid rgba(168, 134, 94, 0.2)"
      : "2px solid rgba(111, 90, 69, 0.22)",
    borderRadius: 2,
    p: 2,
    minHeight: 78,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.04)"
      : "rgba(255, 255, 255, 0.72)",
  };

  const rowStyle = {
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.12)"
      : "1px solid rgba(111, 90, 69, 0.12)",
    borderRadius: 2,
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.04)"
      : "rgba(255, 255, 255, 0.7)",
    transition: "0.18s ease",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(168, 134, 94, 0.08)"
        : "rgba(111, 90, 69, 0.05)",
      boxShadow: isDark
        ? "0 6px 14px rgba(0, 0, 0, 0.2)"
        : "0 6px 14px rgba(111, 90, 69, 0.05)",
    },
  };

  const newRowStyle = {
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.16)"
      : "1px solid rgba(111, 90, 69, 0.14)",
    borderRadius: 2,
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(255, 255, 255, 0.8)",
    boxShadow: isDark
      ? "0 4px 10px rgba(0, 0, 0, 0.2)"
      : "0 4px 10px rgba(111, 90, 69, 0.04)",
  };

  const headerBorderColor = isDark
    ? "rgba(168, 134, 94, 0.2)"
    : "rgba(111, 90, 69, 0.16)";

  const categoryRowStyle = {
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.1)"
      : "1px solid rgba(111, 90, 69, 0.1)",
    borderRadius: 2,
    backgroundColor: isDark
      ? "rgba(255, 255, 255, 0.04)"
      : "rgba(255, 255, 255, 0.58)",
    transition: "0.18s ease",
    "&:hover": {
      backgroundColor: isDark
        ? "rgba(168, 134, 94, 0.08)"
        : "rgba(111, 90, 69, 0.05)",
      transform: "translateY(-1px)",
    },
  };

  const rowGrid = {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "120px 150px 1.7fr 1.2fr 130px 110px",
    },
    gap: { xs: 1, md: 2 },
    alignItems: "center",
    width: "100%",
  };

  const gridStroke = isDark ? "rgba(168, 134, 94, 0.12)" : "rgba(111, 90, 69, 0.12)";
  const lineColor  = isDark ? "#A8865E" : "#6F5A45";

  // --- Budget creation ---
  const handleCreateBudget = async () => {
    if (!monthlyIncome || Number(monthlyIncome) <= 0) return;
    await createBudget(monthlyIncome);
    setAddingNew(false);
    setEditingId(null);
  };

  // --- Computed values ---
  const totalIncome = useMemo(() => {
    const extraIncome = transactions
      .filter((t) => String(t.category).toUpperCase() === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return (Number(monthlyIncome) || 0) + extraIncome;
  }, [monthlyIncome, transactions]);

  const totalAmountSpent = useMemo(
    () =>
      transactions
        .filter((t) => String(t.category).toUpperCase() !== "INCOME")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  const remainingBalance = totalIncome - totalAmountSpent;

  const overviewPieData = [
    { name: "Remaining", value: Math.max(remainingBalance, 0) },
    { name: "Spent",     value: totalAmountSpent },
  ];

  const breakdownPieData = useMemo(() =>
    Object.keys(CATEGORY_COLORS)
      .map((cat) => ({
        name: cat,
        value: transactions
          .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
          .reduce((sum, t) => sum + Number(t.amount || 0), 0),
      }))
      .filter((d) => d.value > 0),
    [transactions]
  );

  const dailySpendingData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyMap = {};
    for (let d = 1; d <= daysInMonth; d++) dailyMap[d] = 0;
    transactions
      .filter((t) => String(t.category).toUpperCase() !== "INCOME" && t.date)
      .forEach((t) => {
        const [tYear, tMonth, tDay] = t.date.split("-").map(Number);
        if (tYear === year && tMonth - 1 === month) {
          dailyMap[tDay] = (dailyMap[tDay] || 0) + Number(t.amount || 0);
        }
      });
    return Object.entries(dailyMap).map(([day, total]) => ({ day: `${day}`, total }));
  }, [transactions]);

  const barData = useMemo(() => {
    if (!budgetLimits) return [];
    return categories
      .filter((cat) => cat !== "Income")
      .map((cat) => {
        const spent = transactions
          .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);
        const limit = Number(budgetLimits[cat] || 0);
        return {
          category: cat,
          under: Math.min(spent, limit),
          over: spent > limit ? spent - limit : 0,
        };
      });
  }, [budgetLimits, transactions]);

  const categoryRows = useMemo(() => {
    if (!budgetLimits) return [];
    return categories.map((cat) => {
      const spent = transactions
        .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const allocated = cat === "Income" ? 0 : Number(budgetLimits[cat] || 0);
      const remaining = cat === "Income" ? spent : allocated - spent;
      return { category: cat, allocated, remaining };
    });
  }, [budgetLimits, transactions]);

  // --- Sorting ---
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection(field === "date" ? "desc" : "asc");
  };

  const sortedTransactions = useMemo(() => {
    const arr = [...transactions];
    arr.sort((a, b) => {
      if (sortField === "id")       return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      if (sortField === "date")     return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      if (sortField === "item")     return sortDirection === "asc" ? a.item.localeCompare(b.item) : b.item.localeCompare(a.item);
      if (sortField === "category") return sortDirection === "asc" ? a.category.localeCompare(b.category) : b.category.localeCompare(a.category);
      if (sortField === "amount")   return sortDirection === "asc" ? Number(a.amount) - Number(b.amount) : Number(b.amount) - Number(a.amount);
      return 0;
    });
    return arr;
  }, [transactions, sortField, sortDirection]);

  // --- Add new transaction ---
  const startAddNew = () => {
    setEditingId(null);
    setAddingNew(true);
    setNewDraft({ id: Date.now(), date: "", item: "", category: "Housing", amount: "" });
  };

  const cancelAddNew = () => {
    setAddingNew(false);
    setNewDraft({ ...emptyDraft, id: Date.now() });
  };

  const saveNewTransaction = async () => {
    if (!newDraft.date || !newDraft.item || newDraft.amount === "") return;
    try {
      await addTransaction({
        date: newDraft.date,
        item: String(newDraft.item).toUpperCase(),
        category: String(newDraft.category).toUpperCase(),
        amount: parseFloat(newDraft.amount),
      });
      cancelAddNew();
    } catch (err) {
      console.error("Failed to save transaction:", err);
    }
  };

  // --- Edit transaction ---
  const startEdit = (transaction) => {
    setAddingNew(false);
    setEditingId(transaction.id);
    setEditDraft({ ...transaction, amount: String(transaction.amount) });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(emptyDraft);
  };

  const saveEdit = async () => {
    if (!editDraft.date || !editDraft.item || editDraft.amount === "") return;
    try {
      await editTransaction(editingId, {
        date: editDraft.date,
        item: String(editDraft.item).toUpperCase(),
        category: String(editDraft.category).toUpperCase(),
        amount: parseFloat(editDraft.amount),
      });
      cancelEdit();
    } catch (err) {
      console.error("Failed to edit transaction:", err);
    }
  };

  // --- Delete transaction ---
  const handleDelete = async (id) => {
    try {
      await removeTransaction(id);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    }
  };

  const sortHeaderStyle = (field) => ({
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none",
    transition: "0.2s ease",
    color: sortField === field ? theme.palette.primary.main : theme.palette.text.primary,
    "&:hover": { color: theme.palette.primary.main, textDecoration: "underline" },
  });

  const amountColor = (category) =>
    category === "INCOME"
      ? isDark ? "#7FB187" : "#5E8B63"
      : isDark ? "#D47A70" : "#B65A4E";

  const showStats = activeChart === "donut";

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>

      {/* ── Page header with Edit Income button ── */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
          Budget
        </Typography>
        {budgetLimits && (
          <Button
            variant="outlined"
            onClick={() => setBudgetLimits(null)}
            sx={{ borderColor: theme.palette.text.secondary, color: theme.palette.text.primary }}
          >
            Edit Income
          </Button>
        )}
      </Box>

      {/* ── Create budget form ── */}
      {!budgetLimits && (
        <Box sx={{ ...cardStyle, maxWidth: 680, mx: "auto", mt: 4 }}>
          <Typography variant="h6" align="center" gutterBottom>
            Create Your Monthly Budget
          </Typography>
          <Typography align="center" sx={{ mb: 3, color: theme.palette.text.secondary }}>
            Enter your monthly income and Vestly will generate a standard budget breakdown.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <TextField
              label="Monthly Income"
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
            />
            <Button variant="contained" onClick={handleCreateBudget}>
              Create Budget
            </Button>
          </Box>
        </Box>
      )}

      {budgetLimits && (
        <>
          {/* ── Top row: Overview card + Category Limits card ── */}
          <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>

            {/* OVERVIEW CARD */}
            <Box
              sx={{
                ...cardStyle,
                flex: 1,
                minWidth: { xs: "100%", md: "420px" },
                // Fixed min-height so the card never collapses
                minHeight: 460,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                {chartTitles[activeChart]}
              </Typography>

              {/*
                KEY FIX: on small screens (< md) the stats stack ABOVE the chart.
                On desktop they sit side-by-side.
                Using md (900px) instead of sm (600px) gives the chart enough room.
              */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 2,
                  alignItems: { xs: "stretch", md: "center" },
                  flex: 1,
                }}
              >
                {/* Stats column — only shown on donut view */}
                {showStats && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", md: "column" },
                      flexWrap: "wrap",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <Box sx={{ ...miniStatStyle, flex: { xs: 1, md: "unset" } }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                        Monthly Income
                      </Typography>
                      <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        ${Number(totalIncome).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ ...miniStatStyle, flex: { xs: 1, md: "unset" } }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                        Total Amount Spent
                      </Typography>
                      <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                        ${Number(totalAmountSpent).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ ...miniStatStyle, flex: { xs: 1, md: "unset" } }}>
                      <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                        Amount Remaining
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: remainingBalance >= 0 ? amountColor("INCOME") : amountColor("OTHER") }}
                      >
                        ${Number(remainingBalance).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/*
                  Chart area — hardcoded 280px height so Recharts always
                  has a real pixel size regardless of flex parent behaviour
                */}
                <Box sx={{ flex: 1, height: 280, minHeight: 280 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    {activeChart === "donut" ? (
                      <PieChart>
                        <Pie data={overviewPieData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={45}>
                          <Cell fill={isDark ? "#7FB187" : "#8EAE7A"} />
                          <Cell fill={isDark ? "#D47A70" : "#B65A4E"} />
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    ) : activeChart === "bar" ? (
                      <BarChart layout="vertical" data={barData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis type="number" tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} stroke={theme.palette.text.secondary} />
                        <YAxis type="category" dataKey="category" width={100} tick={{ fill: theme.palette.text.primary, fontSize: 11 }} stroke={theme.palette.text.secondary} tickFormatter={(v) => (v.length > 8 ? `${v.slice(0, 8)}…` : v)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="under" stackId="a" fill={isDark ? "#7FB187" : "#8EAE7A"} radius={[0, 4, 4, 0]} />
                        <Bar dataKey="over"  stackId="a" fill={isDark ? "#D47A70" : "#B65A4E"} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    ) : activeChart === "breakdown" ? (
                      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <Pie
                          data={breakdownPieData}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                          innerRadius={35}
                          paddingAngle={2}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          labelLine={true}
                        >
                          {breakdownPieData.map((entry) => (
                            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#DCCFC1"} fillOpacity={0.92} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend formatter={(value) => (
                          <span style={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>{value}</span>
                        )} />
                      </PieChart>
                    ) : (
                      <LineChart data={dailySpendingData} margin={{ top: 4, right: 16, left: 8, bottom: 16 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                        <XAxis dataKey="day" tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} stroke={theme.palette.text.secondary} label={{ value: "Day of Month", position: "insideBottom", offset: -8, fill: theme.palette.text.secondary, fontSize: 11 }} />
                        <YAxis tick={{ fill: theme.palette.text.secondary, fontSize: 11 }} stroke={theme.palette.text.secondary} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="total" name="Spent" stroke={lineColor} strokeWidth={2} dot={{ fill: lineColor, r: 3 }} activeDot={{ r: 5 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </Box>

              {/* Chart switcher buttons */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2, pt: 2, flexWrap: "wrap", borderTop: `1px solid ${headerBorderColor}` }}>
                {CHART_OPTIONS.map((opt) => (
                  <Button
                    key={opt.key}
                    size="small"
                    variant={activeChart === opt.key ? "contained" : "outlined"}
                    onClick={() => setActiveChart(opt.key)}
                    sx={{ minWidth: 100 }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* CATEGORY LIMITS */}
            <Box sx={{ ...cardStyle, flex: 1, minWidth: { xs: "100%", md: "420px" } }}>
              <Typography variant="h6" align="center" gutterBottom>Category Limits</Typography>

              <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", columnGap: 2, px: 2, pb: 1.25, borderBottom: `2px solid ${headerBorderColor}` }}>
                <Typography fontWeight={700} sx={{ color: theme.palette.text.primary }}>Category</Typography>
                <Typography fontWeight={700} align="right" sx={{ color: theme.palette.text.primary }}>Allocated</Typography>
                <Typography fontWeight={700} align="right" sx={{ color: theme.palette.text.primary }}>Remaining</Typography>
              </Box>

              <Box sx={{ mt: 1 }}>
                {categoryRows.map((row) => (
                  <Box
                    key={row.category}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1fr 1fr",
                      columnGap: 2,
                      alignItems: "center",
                      px: 2,
                      py: 1.4,
                      mb: 1,
                      ...categoryRowStyle,
                    }}
                  >
                    <Typography sx={{ color: theme.palette.text.primary }}>{row.category}</Typography>
                    <Typography align="right" sx={{ color: theme.palette.text.primary }}>
                      ${Number(row.allocated).toFixed(2)}
                    </Typography>
                    <Typography
                      align="right"
                      sx={{
                        color: row.remaining >= 0 ? amountColor("INCOME") : amountColor("OTHER"),
                        fontWeight: 700,
                      }}
                    >
                      ${Number(row.remaining).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── TRANSACTIONS ── */}
          <Box sx={cardStyle}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
              <Typography variant="h6" align="center" sx={{ flex: 1 }}>Transactions</Typography>
              {!addingNew ? (
                <Button variant="contained" onClick={startAddNew}>Add New</Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="contained" onClick={saveNewTransaction}>Save</Button>
                  <Button variant="outlined" onClick={cancelAddNew}>Cancel</Button>
                </Box>
              )}
            </Box>

            {/* Horizontal scroll wrapper keeps table usable on all screen sizes */}
            <Box sx={{ overflowX: "auto" }}>

              {/* Header row — hidden on mobile since columns stack */}
              <Box sx={{ ...rowGrid, px: 2, py: 1.5, borderBottom: `2px solid ${headerBorderColor}`, display: { xs: "none", md: "grid" } }}>
                <Typography sx={sortHeaderStyle("id")}       onClick={() => toggleSort("id")}>Transaction ID</Typography>
                <Typography sx={sortHeaderStyle("date")}     onClick={() => toggleSort("date")}>Date</Typography>
                <Typography sx={sortHeaderStyle("item")}     onClick={() => toggleSort("item")}>Item</Typography>
                <Typography sx={sortHeaderStyle("category")} onClick={() => toggleSort("category")}>Category</Typography>
                <Typography sx={sortHeaderStyle("amount")}   onClick={() => toggleSort("amount")}>Amount</Typography>
                <Typography fontWeight={700} sx={{ color: theme.palette.text.primary }}>Actions</Typography>
              </Box>

              {/* New transaction row */}
              {addingNew && (
                <Box sx={{ ...rowGrid, mt: 1.5, px: 2, py: 2, ...newRowStyle }}>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: "0.85rem" }}>New</Typography>
                  <TextField type="date" size="small" value={newDraft.date} onChange={(e) => setNewDraft((prev) => ({ ...prev, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
                  <TextField size="small" placeholder="Item name" value={newDraft.item} onChange={(e) => setNewDraft((prev) => ({ ...prev, item: e.target.value }))} />
                  <TextField select size="small" value={newDraft.category} onChange={(e) => setNewDraft((prev) => ({ ...prev, category: e.target.value }))}>
                    {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </TextField>
                  <TextField size="small" type="number" placeholder="$0.00" value={newDraft.amount} onChange={(e) => setNewDraft((prev) => ({ ...prev, amount: e.target.value }))} />
                  <Box />
                </Box>
              )}

              {/* Transaction list */}
              <Box sx={{ mt: 1.5 }}>
                {sortedTransactions.length === 0 && !addingNew && (
                  <Typography sx={{ px: 2, py: 3, opacity: 0.7, color: theme.palette.text.secondary }}>
                    No transactions yet.
                  </Typography>
                )}

                {sortedTransactions.map((t) => {
                  const isEditing = editingId === t.id;
                  return (
                    <Box key={t.id} sx={{ ...rowGrid, px: 2, py: 2, mb: 1.25, ...rowStyle }}>
                      <Typography sx={{ color: theme.palette.text.primary }}>{t.id}</Typography>

                      {isEditing ? (
                        <>
                          <TextField type="date" size="small" value={editDraft.date} onChange={(e) => setEditDraft((prev) => ({ ...prev, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
                          <TextField size="small" value={editDraft.item} onChange={(e) => setEditDraft((prev) => ({ ...prev, item: e.target.value }))} />
                          <TextField select size="small" value={editDraft.category} onChange={(e) => setEditDraft((prev) => ({ ...prev, category: e.target.value }))}>
                            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                          </TextField>
                          <TextField size="small" type="number" value={editDraft.amount} onChange={(e) => setEditDraft((prev) => ({ ...prev, amount: e.target.value }))} />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" variant="contained" onClick={saveEdit}>Save</Button>
                            <Button size="small" variant="outlined" onClick={cancelEdit}>Cancel</Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.date}</Typography>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.item}</Typography>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.category}</Typography>
                          <Typography sx={{ color: amountColor(t.category), fontWeight: 700 }}>
                            ${Number(t.amount).toFixed(2)}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" onClick={() => startEdit(t)}>Edit</Button>
                            <Button size="small" color="error" onClick={() => handleDelete(t.id)}>Delete</Button>
                          </Box>
                        </>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default BudgetPage;
