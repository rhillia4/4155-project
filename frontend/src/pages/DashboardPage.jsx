import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Card, CardActionArea, CardContent } from "@mui/material";
import { useBudget } from "../context/BudgetContext";
import BudgetPieChart from "../components/charts/BudgetPieChart.jsx";
import StockIncomeGraph from "../components/portfolio/StockIncomeGraph.jsx";
import PortfolioComposition from "../components/portfolio/PortfolioComposition.jsx";
import { usePortfolioContext } from '../context/PortfolioContext.jsx';
import { usePortfolioSnapshots } from '../hooks/usePortfolioSnapshot.js';
import { usePortfolios } from '../hooks/usePortfolios.js';
import { useHoldings } from '../hooks/useHoldings.js';
import { useNavigate } from 'react-router-dom';

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
  const [enrichedPortfolios, setEnrichedPortfolios] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [bestPortfolio, setBestPortfolio] = useState(null);
  const { portfolio, setPortfolio } = usePortfolioContext();
  const { fetchPortfolios } = usePortfolios();
  const { getHoldings } = useHoldings();
  const { getPortfolioSnapshotDetails } = usePortfolioSnapshots(portfolio?.id);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    const loadPortfolios = async () => {
      const data = await fetchPortfolios();
      setPortfolios(data);
      console.log("Fetched portfolios:", data);
    };
    loadPortfolios();
  }, []);

  useEffect(() => {
    if (!portfolios?.length) return;
    const loadData = async () => {
      try {
        const enriched = await Promise.all(
          portfolios.map(async (p) => {
            const [holdings, snapshots] = await Promise.all([
              getHoldings(p.id),
              getPortfolioSnapshotDetails(p.id),
            ]);
            return { ...p, holdings, snapshots };
          })
        );
        setEnrichedPortfolios(enriched);
      } catch (err) {
        console.error(err.message || 'Failed to load portfolio data');
      }
    };
    loadData();
  }, [portfolios]);

  useEffect(() => {
    if (!enrichedPortfolios.length) return;
    const best = enrichedPortfolios.reduce((best, p) => {
      const totalValue = (p.holdings || []).reduce((sum, h) => sum + (h.value || 0), 0);
      return totalValue > (best.totalValue || 0) ? { ...p, totalValue } : best;
    }, {});
    // Only set if we actually found a portfolio with an id
    if (best?.id) setBestPortfolio(best);
  }, [enrichedPortfolios]);

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
    categorySpent[cat] = (transactions || [])
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
    // Removed overflow: "hidden" — this was clipping charts on resize
  };

  const gridStroke = isDark
    ? "rgba(168, 134, 94, 0.12)"
    : "rgba(111, 90, 69, 0.12)";

  const barUnderFill = isDark ? "#7FB187" : "#8EAE7A";
  const barOverFill  = isDark ? "#D47A70" : "#B65A4E";

  return (
    <Box
      sx={{
        p: 2,
        display: "flex",
        // Stack vertically on tablet/mobile, side-by-side on desktop
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        // Let the page scroll naturally on small screens instead of trying to fit in 100% height
        minHeight: { xs: "auto", md: "calc(100vh - 180px)" },
        boxSizing: "border-box",
        overflowY: { xs: "visible", md: "auto" },
      }}
    >
      {/* ── LEFT COLUMN ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
        }}
      >
        {/* Spending Breakdown */}
        <Box
          sx={{
            ...cardStyle,
            // Always at least 380px tall — gives the pie chart room to breathe
            minHeight: 380,
            flex: 1,
          }}
        >
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
          >
            Spending Breakdown
          </Typography>
          {/*
            KEY FIX: minHeight: 280 (not 0) so Recharts never collapses the chart.
            width: "100%" ensures ResponsiveContainer inside BudgetPieChart has a real width.
          */}
          <Box sx={{ flex: 1, minHeight: 280, width: "100%" }}>
            <BudgetPieChart budget={{ transactions }} />
          </Box>
        </Box>

        {/* Category Limits */}
        <Box
          sx={{
            ...cardStyle,
            minHeight: 320,
            flex: 1,
          }}
        >
          <Typography
            align="center"
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
          >
            Category Limits
          </Typography>
          {/* We are locking the ResponsiveContainer to exactly 260px tall */}
          <Box sx={{ flex: 1, minHeight: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height={260}> {/* <--- CHANGED THIS LINE */}
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
                <Bar dataKey="over"  stackId="a" fill={barOverFill}  radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>

      {/* ── RIGHT COLUMN: Portfolio ── */}
      <Box
        sx={{
          ...cardStyle,
          flex: 1,
          minWidth: 0,
          // On mobile stack below the charts; give it enough height to be useful
          minHeight: { xs: 500, md: 0 },
        }}
      >
        {bestPortfolio?.id ? (
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1, flexShrink: 0 }}>
              {bestPortfolio.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: 2,
              }}
            >
              {/* Stock Income Graph */}
              <Card sx={{ width: "100%", flex: 1, minHeight: 260 }}>
                <CardActionArea
                  onClick={() => { setPortfolio(bestPortfolio); navigate("/portfolio"); }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ width: "100%", height: "100%", p: 0 }}>
                    <StockIncomeGraph
                      snapshots={bestPortfolio.snapshots}
                      holdings={bestPortfolio.holdings}
                      isDashboard={true}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>

              {/* Portfolio Composition */}
              <Card sx={{ width: "100%", flex: 1, minHeight: 260 }}>
                <CardActionArea
                  onClick={() => { setPortfolio(bestPortfolio); navigate("/portfolio"); }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ width: "100%", height: "100%", p: 0 }}>
                    <PortfolioComposition
                      holdings={bestPortfolio.holdings}
                      isDashboard={true}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 200,
            }}
          >
            <Typography
              align="center"
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              No portfolio data available. Please create a portfolio to see the overview.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DashboardPage;
