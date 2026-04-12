import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';

function StockIncomeGraph({ snapshots, holdings }) {
    const [xaxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        if (snapshots && snapshots.length > 0) {
            const sortedSnapshots = [...snapshots].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            
            const values = sortedSnapshots.map(snap => snap.total_value);
            if (new Date(snapshots[0].timestamp).toLocaleDateString() === new Date().toLocaleDateString()) {
                values[0] = holdings.reduce((sum, h) => sum + (h.value), 0);
            }else {
                values.unshift(holdings.reduce((sum, h) => sum + (h.value), 0));
            }

            setXAxisData(
              sortedSnapshots.map(snap =>
                new Date(snap.timestamp).toLocaleDateString()
              )
            );
            setSeriesData(values);
            console.log("Processed snapshots for graph:", { xaxisData, seriesData });
          }else if (holdings && holdings.length > 0) {
            setXAxisData([new Date().toLocaleDateString()]);
            setSeriesData([holdings.reduce((sum, h) => sum + (h.value), 0)]);
          }
    }, [snapshots, holdings]);

    return (
    <Paper sx={{ p: 2, height: "100%", display: 'flex', flexDirection: 'column' }}>
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
            <Typography color="textSecondary">No data yet</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default StockIncomeGraph;