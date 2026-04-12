import React, { useMemo, useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper } from '@mui/material';
import { getStockData } from '../../services/api.js';

function PortfolioComposition({ holdings }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!holdings || holdings.length === 0) {
      setRows([]);
      return;
    }
    setRows(holdings);
  }, [holdings]);


  const chartData = useMemo(() => {
    if (!rows.length) return [];
    const totals = rows.reduce((acc, h) => {
      acc[h.asset.symbol] = (acc[h.asset.symbol] || 0) + (Number(h.value) || 0);
      return acc;
    }, {});
    return Object.keys(totals).map((symbol, i) => ({ id: i, value: totals[symbol], label: symbol }));
  }, [rows]);

  return (
    <Paper sx={{ p: 2,  height: '350', display: 'flex', flexDirection: 'column'}}>
      <Typography variant="h6" color="white">Portfolio Composition</Typography>
      <Box sx={{ height: 250, mt: 2 }}>
        <PieChart series={[{  
            data: chartData,
            innerRadius: 30,
            outerRadius: 120,
          }]} 
      />
      </Box>
    </Paper>
  );
}
export default PortfolioComposition;