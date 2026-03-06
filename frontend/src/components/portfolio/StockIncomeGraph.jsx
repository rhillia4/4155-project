import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper } from '@mui/material';

function StockIncomeGraph({ transactions }) {
    const [xaxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            setXAxisData(transactions.map(tx => tx.executed_at || tx.date));
            
            const deltaChanges = transactions.map((tx, index) => {
                const currentValue = tx.shares * tx.price;
                if (index === 0) return 0;
                const prevTx = transactions[index - 1];
                const prevValue = prevTx.shares * prevTx.price;

                return currentValue - prevValue;
            });
            setSeriesData(deltaChanges);
        }
    }, [transactions]); // Only runs when the data actually changes

    return (
    <Paper sx={{ p: 2, borderRadius: 2, height: 350, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Portfolio History
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        {seriesData.length > 0 ? (
          <LineChart
            hideLegend
            xAxis={[{ data: xaxisData, scaleType: 'point' }]}
            series={[{ data: seriesData, area: true }]}
            sx={{ width: '100%', height: '100%' }}
          />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="textSecondary">No performance data yet</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default StockIncomeGraph;