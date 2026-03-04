import React, { useState } from "react";
import { Box, Typography, TextField, Button, MenuItem, List } from "@mui/material";

const categories = ["Housing", "Transportation", "Insurance", "Utilities", "Food", "Other", "Income"];

// Capitalize first letter of each word
const capitalizeWords = (str) =>
  str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");

function BudgetPage({ transactions, setTransactions, budgetLimits, setBudgetLimits, monthlyIncome, setMonthlyIncome }) {
  const [transDate, setTransDate] = useState("");
  const [transItem, setTransItem] = useState("");
  const [transCategory, setTransCategory] = useState(categories[0]);
  const [transAmount, setTransAmount] = useState("");
  const [categorySort, setCategorySort] = useState("asc"); // For sorting categories

  const standardPercentages = {
    Housing: 30,
    Transportation: 15,
    Insurance: 15,
    Utilities: 12.5,
    Food: 15,
    Other: 12.5,
    Income: 0,
  };

  const handleCreateStandardBudget = () => {
    if (!monthlyIncome) return;
    const limits = {};
    Object.keys(standardPercentages).forEach((cat) => {
      limits[cat] = parseFloat(((monthlyIncome * standardPercentages[cat]) / 100).toFixed(2));
    });
    setBudgetLimits(limits);
    setTransactions([]);
  };

  const handleAddTransaction = () => {
    if (!transDate || !transItem || !transAmount) return;

    setTransactions((prev) => [
      ...prev,
      {
        id: Date.now(),
        date: transDate,
        item: capitalizeWords(transItem),
        category: capitalizeWords(transCategory),
        amount: parseFloat(transAmount),
      },
    ]);

    setTransDate("");
    setTransItem("");
    setTransCategory(categories[0]);
    setTransAmount("");
  };

  const handleEditTransaction = (id, field, value) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              [field]: field === "item" || field === "category" ? capitalizeWords(value) : value,
            }
          : t
      )
    );
  };

  // Sort transactions by category
  const handleCategorySort = () => {
    setTransactions((prev) => {
      const sorted = [...prev].sort((a, b) => {
        if (categorySort === "asc") return a.category.localeCompare(b.category);
        else return b.category.localeCompare(a.category);
      });
      return sorted;
    });
    setCategorySort(categorySort === "asc" ? "desc" : "asc");
  };

  const totalIncome = monthlyIncome
    ? parseFloat(monthlyIncome) + transactions.filter(t => t.category === "Income").reduce((sum, t) => sum + t.amount, 0)
    : 0;

  const totalExpenses = transactions
    .filter(t => t.category !== "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const remainingBalance = totalIncome - totalExpenses;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Budget
      </Typography>

      {/* Monthly Income input */}
      {!budgetLimits && (
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            label="Monthly Income"
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
          <Button variant="contained" onClick={handleCreateStandardBudget}>
            Create Standard Budget
          </Button>
        </Box>
      )}

      {budgetLimits && (
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {/* Left Column: Income / Spent / Remaining */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2">Monthly Income</Typography>
                <Typography>${monthlyIncome}</Typography>
              </Box>
              <Box sx={{ flex: 1, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2">Amount Spent</Typography>
                <Typography>${totalExpenses.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ flex: 1, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                <Typography variant="subtitle2">Remaining Balance</Typography>
                <Typography>${remainingBalance.toFixed(2)}</Typography>
              </Box>
            </Box>

            {/* Category Limits */}
            <Box sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Category Limits
              </Typography>
              <List>
                {Object.keys(budgetLimits).filter(c => c !== "Income").map((cat) => (
                  <Box key={cat} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography>{cat}</Typography>
                    <Typography>${budgetLimits[cat].toFixed(2)}</Typography>
                  </Box>
                ))}
              </List>
            </Box>
          </Box>

          {/* Right Column: Transactions */}
          <Box sx={{ flex: 1, minWidth: 400, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transactions
            </Typography>

            {/* Add Transaction Form */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <TextField
                label="Date"
                type="date"
                value={transDate}
                onChange={(e) => setTransDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Item"
                value={transItem}
                onChange={(e) => setTransItem(e.target.value)}
              />
              <TextField
                select
                label="Category"
                value={transCategory}
                onChange={(e) => setTransCategory(e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Amount"
                type="number"
                value={transAmount}
                onChange={(e) => setTransAmount(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddTransaction}>
                Add
              </Button>
            </Box>

            {/* Transaction Table */}
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", mb: 1, borderBottom: "1px solid #000", p: 1 }}>
              <Typography>Transaction ID</Typography>
              <Typography>Date</Typography>
              <Typography>Item</Typography>
              <Typography onClick={handleCategorySort} sx={{ cursor: "pointer" }}>
                Category {categorySort === "asc" ? "↑" : "↓"}
              </Typography>
              <Typography>Amount</Typography>
            </Box>
            <List>
              {transactions.length === 0 && <Typography>No transactions yet.</Typography>}
              {transactions.map((t, idx) => (
                <Box
                  key={t.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    backgroundColor: "transparent", // no background
                    color: "#fff",
                    borderBottom: "1px solid #1976d2",
                  }}
                >
                  <Typography>{t.id}</Typography>
                  <TextField
                    type="date"
                    value={t.date}
                    onChange={(e) => handleEditTransaction(t.id, "date", e.target.value)}
                    variant="standard"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    value={t.item}
                    onChange={(e) => handleEditTransaction(t.id, "item", e.target.value)}
                    variant="standard"
                    sx={{ width: 120 }}
                  />
                  <TextField
                    select
                    value={t.category}
                    onChange={(e) => handleEditTransaction(t.id, "category", e.target.value)}
                    variant="standard"
                    sx={{ width: 120 }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="number"
                    value={t.amount}
                    onChange={(e) => handleEditTransaction(t.id, "amount", parseFloat(e.target.value))}
                    variant="standard"
                    sx={{ width: 80 }}
                  />
                </Box>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BudgetPage;