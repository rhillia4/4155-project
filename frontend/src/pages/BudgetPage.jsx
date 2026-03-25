import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
 
const capitalizeWords = (str) =>
  String(str || "")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
 
const emptyDraft = {
  id: null,
  date: "",
  item: "",
  category: "Housing",
  amount: "",
};
 
function BudgetPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
 
  const {
    transactions,
    setTransactions,
    budgetLimits,
    setBudgetLimits,
    monthlyIncome,
    setMonthlyIncome,
  } = useBudget();
 
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
 
  const [addingNew, setAddingNew] = useState(false);
  const [newDraft, setNewDraft] = useState({
    ...emptyDraft,
    id: Date.now(),
  });
 
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyDraft);
 
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
    gridTemplateColumns: "120px 150px 1.7fr 1.2fr 130px 110px",
    columnGap: 2,
    alignItems: "center",
    width: "100%",
  };
 
  const createBudget = () => {
    if (!monthlyIncome || Number(monthlyIncome) <= 0) return;
 
    const limits = {};
    Object.keys(standardPercentages).forEach((cat) => {
      limits[cat] = parseFloat(
        ((Number(monthlyIncome) * standardPercentages[cat]) / 100).toFixed(2)
      );
    });
 
    setBudgetLimits(limits);
    setTransactions([]);
    setAddingNew(false);
    setEditingId(null);
  };
 
  const totalIncome = useMemo(() => {
    const extraIncome = transactions
      .filter((t) => t.category === "Income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
 
    return (Number(monthlyIncome) || 0) + extraIncome;
  }, [monthlyIncome, transactions]);
 
  const totalAmountSpent = useMemo(
    () =>
      transactions
        .filter((t) => t.category !== "Income")
        .reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );
 
  const remainingBalance = totalIncome - totalAmountSpent;
 
  const overviewPieData = [
    { name: "Remaining", value: Math.max(remainingBalance, 0) },
    { name: "Spent", value: totalAmountSpent },
  ];
 
  const categoryRows = useMemo(() => {
    if (!budgetLimits) return [];
 
    return categories.map((cat) => {
      const spent = transactions
        .filter((t) => String(t.category).toUpperCase() === cat.toUpperCase())
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
 
      const allocated =
        cat === "Income" ? 0 : Number(budgetLimits[cat] || 0);
 
      const remaining =
        cat === "Income" ? spent : allocated - spent;
 
      return {
        category: cat,
        allocated,
        remaining,
      };
    });
  }, [budgetLimits, transactions]);
 
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
      if (sortField === "id") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      if (sortField === "item") {
        return sortDirection === "asc"
          ? a.item.localeCompare(b.item)
          : b.item.localeCompare(a.item);
      }
      if (sortField === "category") {
        return sortDirection === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
      if (sortField === "amount") {
        return sortDirection === "asc"
          ? Number(a.amount) - Number(b.amount)
          : Number(b.amount) - Number(a.amount);
      }
      return 0;
    });
 
    return arr;
  }, [transactions, sortField, sortDirection]);
 
  const startAddNew = () => {
    setEditingId(null);
    setAddingNew(true);
    setNewDraft({
      id: Date.now(),
      date: "",
      item: "",
      category: "Housing",
      amount: "",
    });
  };
 
  const cancelAddNew = () => {
    setAddingNew(false);
    setNewDraft({
      ...emptyDraft,
      id: Date.now(),
    });
  };
 
  const saveNewTransaction = () => {
    if (!newDraft.date || !newDraft.item || newDraft.amount === "") return;
 
    setTransactions((prev) => [
      {
        id: newDraft.id,
        date: newDraft.date,
        item: String(newDraft.item).toUpperCase(),
        category: String(newDraft.category).toUpperCase(),
        amount: parseFloat(newDraft.amount),
      },
      ...prev,
    ]);
 
    cancelAddNew();
  };
 
  const startEdit = (transaction) => {
    setAddingNew(false);
    setEditingId(transaction.id);
    setEditDraft({
      ...transaction,
      amount: String(transaction.amount),
    });
  };
 
  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft(emptyDraft);
  };
 
  const saveEdit = () => {
    if (!editDraft.date || !editDraft.item || editDraft.amount === "") return;
 
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? {
              ...t,
              date: editDraft.date,
              item: String(editDraft.item).toUpperCase(),
              category: String(editDraft.category).toUpperCase(),
              amount: parseFloat(editDraft.amount),
            }
          : t
      )
    );
 
    cancelEdit();
  };
 
  const sortHeaderStyle = (field) => ({
    fontWeight: 700,
    cursor: "pointer",
    userSelect: "none",
    transition: "0.2s ease",
    color: sortField === field ? theme.palette.primary.main : theme.palette.text.primary,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
  });
 
  const amountColor = (category) =>
    category === "Income"
      ? isDark ? "#7FB187" : "#5E8B63"
      : isDark ? "#D47A70" : "#B65A4E";
 
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Budget
      </Typography>
 
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
            <Button variant="contained" onClick={createBudget}>
              Create Budget
            </Button>
          </Box>
        </Box>
      )}
 
      {budgetLimits && (
        <>
          <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
            {/* OVERVIEW */}
            <Box sx={{ ...cardStyle, flex: 1, minWidth: 420 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Overview
              </Typography>
 
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.15fr",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={miniStatStyle}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                      Monthly Income
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                      ${Number(totalIncome).toFixed(2)}
                    </Typography>
                  </Box>
 
                  <Box sx={miniStatStyle}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                      Total Amount Spent
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                      ${Number(totalAmountSpent).toFixed(2)}
                    </Typography>
                  </Box>
 
                  <Box sx={miniStatStyle}>
                    <Typography variant="subtitle2" sx={{ opacity: 0.75, color: theme.palette.text.secondary }}>
                      Amount Remaining
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: remainingBalance >= 0 ? amountColor("Income") : amountColor("Other") }}
                    >
                      ${Number(remainingBalance).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
 
                <Box sx={{ height: 280, pt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overviewPieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        innerRadius={45}
                      >
                        <Cell fill={isDark ? "#7FB187" : "#8EAE7A"} />
                        <Cell fill={isDark ? "#D47A70" : "#B65A4E"} />
                      </Pie>
                      <Tooltip
                        formatter={(value) => `$${Number(value).toFixed(2)}`}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          color: theme.palette.text.primary,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Box>
            </Box>
 
            {/* CATEGORY LIMITS */}
            <Box sx={{ ...cardStyle, flex: 1, minWidth: 420 }}>
              <Typography variant="h6" align="center" gutterBottom>
                Category Limits
              </Typography>
 
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 1fr 1fr",
                  columnGap: 2,
                  px: 2,
                  pb: 1.25,
                  borderBottom: `2px solid ${headerBorderColor}`,
                }}
              >
                <Typography fontWeight={700} sx={{ color: theme.palette.text.primary }}>Category</Typography>
                <Typography fontWeight={700} align="right" sx={{ color: theme.palette.text.primary }}>
                  Allocated
                </Typography>
                <Typography fontWeight={700} align="right" sx={{ color: theme.palette.text.primary }}>
                  Remaining
                </Typography>
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
                        color: row.remaining >= 0 ? amountColor("Income") : amountColor("Other"),
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
 
          {/* TRANSACTIONS */}
          <Box sx={cardStyle}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6" align="center" sx={{ flex: 1 }}>
                Transactions
              </Typography>
 
              {!addingNew ? (
                <Button variant="contained" onClick={startAddNew}>
                  Add New
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button variant="contained" onClick={saveNewTransaction}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={cancelAddNew}>
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
 
            <Box sx={{ overflowX: "auto" }}>
              <Box
                sx={{
                  ...rowGrid,
                  px: 2,
                  py: 1.5,
                  borderBottom: `2px solid ${headerBorderColor}`,
                  minWidth: 900,
                }}
              >
                <Typography sx={sortHeaderStyle("id")} onClick={() => toggleSort("id")}>
                  Transaction ID
                </Typography>
                <Typography sx={sortHeaderStyle("date")} onClick={() => toggleSort("date")}>
                  Date
                </Typography>
                <Typography sx={sortHeaderStyle("item")} onClick={() => toggleSort("item")}>
                  Item
                </Typography>
                <Typography sx={sortHeaderStyle("category")} onClick={() => toggleSort("category")}>
                  Category
                </Typography>
                <Typography sx={sortHeaderStyle("amount")} onClick={() => toggleSort("amount")}>
                  Amount
                </Typography>
                <Typography fontWeight={700} sx={{ color: theme.palette.text.primary }}>Edit</Typography>
              </Box>
 
              {addingNew && (
                <Box
                  sx={{
                    ...rowGrid,
                    minWidth: 900,
                    mt: 1.5,
                    px: 2,
                    py: 2,
                    ...newRowStyle,
                  }}
                >
                  <Typography sx={{ color: theme.palette.text.primary }}>{newDraft.id}</Typography>
 
                  <TextField
                    type="date"
                    size="small"
                    value={newDraft.date}
                    onChange={(e) =>
                      setNewDraft((prev) => ({ ...prev, date: e.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                  />
 
                  <TextField
                    size="small"
                    placeholder="Item name"
                    value={newDraft.item}
                    onChange={(e) =>
                      setNewDraft((prev) => ({ ...prev, item: e.target.value }))
                    }
                  />
 
                  <TextField
                    select
                    size="small"
                    value={newDraft.category}
                    onChange={(e) =>
                      setNewDraft((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>
 
                  <TextField
                    size="small"
                    type="number"
                    placeholder="$0.00"
                    value={newDraft.amount}
                    onChange={(e) =>
                      setNewDraft((prev) => ({ ...prev, amount: e.target.value }))
                    }
                  />
 
                  <Typography sx={{ opacity: 0.6, color: theme.palette.text.secondary }}>New</Typography>
                </Box>
              )}
 
              <Box sx={{ mt: 1.5 }}>
                {sortedTransactions.length === 0 && !addingNew && (
                  <Typography sx={{ px: 2, py: 3, opacity: 0.7, color: theme.palette.text.secondary }}>
                    No transactions yet.
                  </Typography>
                )}
 
                {sortedTransactions.map((t) => {
                  const isEditing = editingId === t.id;
 
                  return (
                    <Box
                      key={t.id}
                      sx={{
                        ...rowGrid,
                        minWidth: 900,
                        px: 2,
                        py: 2,
                        mb: 1.25,
                        ...rowStyle,
                      }}
                    >
                      <Typography sx={{ color: theme.palette.text.primary }}>{t.id}</Typography>
 
                      {isEditing ? (
                        <>
                          <TextField
                            type="date"
                            size="small"
                            value={editDraft.date}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, date: e.target.value }))
                            }
                            InputLabelProps={{ shrink: true }}
                          />
 
                          <TextField
                            size="small"
                            value={editDraft.item}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, item: e.target.value }))
                            }
                          />
 
                          <TextField
                            select
                            size="small"
                            value={editDraft.category}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, category: e.target.value }))
                            }
                          >
                            {categories.map((cat) => (
                              <MenuItem key={cat} value={cat}>
                                {cat}
                              </MenuItem>
                            ))}
                          </TextField>
 
                          <TextField
                            size="small"
                            type="number"
                            value={editDraft.amount}
                            onChange={(e) =>
                              setEditDraft((prev) => ({ ...prev, amount: e.target.value }))
                            }
                          />
 
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button size="small" variant="contained" onClick={saveEdit}>
                              Save
                            </Button>
                            <Button size="small" variant="outlined" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.date}</Typography>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.item}</Typography>
                          <Typography sx={{ color: theme.palette.text.primary }}>{t.category}</Typography>
                          <Typography
                            sx={{
                              color: amountColor(t.category),
                              fontWeight: 700,
                            }}
                          >
                            ${Number(t.amount).toFixed(2)}
                          </Typography>
                          <Button size="small" onClick={() => startEdit(t)}>
                            Edit
                          </Button>
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