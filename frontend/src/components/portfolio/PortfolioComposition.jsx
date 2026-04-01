import React, { useMemo } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper } from '@mui/material';

function PortfolioComposition({ transactions }) {
  const chartData = useMemo(() => {
    if (!transactions) return [];
    const totals = transactions.reduce((acc, t) => {
      acc[t.asset.symbol] = (acc[t.asset.symbol] || 0) + (t.shares * t.price);
      return acc;
    }, {});
    return Object.keys(totals).map((symbol, i) => ({ id: i, value: totals[symbol], label: symbol }));
  }, [transactions]);

  return (
    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider',height: '350' }}>
      <Typography variant="h6" color="white">Portfolio Composition</Typography>
      <Box sx={{ height: 250, mt: 2 }}>
        <PieChart series={[{ data: chartData, innerRadius: 30, outerRadius: 80 }]} />
      </Box>
    </Paper>
  );
}
export default PortfolioComposition;