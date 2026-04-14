import React, { useMemo, useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper } from '@mui/material';
import { getStockData } from '../../services/api.js';

function PortfolioComposition({ holdings, isDashboard = false}) {
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
    <Paper sx={{ p: 2,  height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Typography variant="h6" color="white">Portfolio Composition</Typography>
      <Box sx={{ height: 250, mt: 2 }}>
          {chartData.length > 0 ? (
        <PieChart series={[{  
            data: chartData,
            outerRadius: isDashboard ? "75%" : "85%",          }]} 
          // Hide legend on dashboard to prevent cutoff
          slotProps={{ 
            legend: { hidden: isDashboard ? true : { xs: true, md: false } } 
          }}
      />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="textSecondary">No data yet</Typography>
            </Box>
          )}
      </Box>
    </Paper>
  );
}
export default PortfolioComposition;