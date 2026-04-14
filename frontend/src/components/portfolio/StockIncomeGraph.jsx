import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper } from '@mui/material';
import dayjs from 'dayjs';

function StockIncomeGraph({ snapshots, holdings, isDashboard = false}) {
    const [xaxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
      if (snapshots && snapshots.length > 0) {
        const sortedSnapshots = [...snapshots].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const values = sortedSnapshots.map(s => s.total_value);
        const dates = sortedSnapshots.map(s =>
          new Date(s.timestamp).toLocaleDateString()
        );

        const currentValue = (holdings || []).reduce((sum, h) => sum + h.value, 0);

        const lastIndex = sortedSnapshots.length - 1;
        const lastDate = new Date(sortedSnapshots[lastIndex].timestamp).toLocaleDateString();
        const today = new Date().toLocaleDateString();

        if (lastDate === today) {
          // overwrite today's snapshot
          values[lastIndex] = currentValue;
        } else {
          // append current value to the end
          values.push(currentValue);
          dates.push(today);
        }

        setXAxisData(dates);
        setSeriesData(values);


      } else if (holdings && holdings.length > 0) {
        const currentValue = holdings.reduce((sum, h) => sum + h.value, 0);

        setXAxisData([new Date().toLocaleDateString()]);
        setSeriesData([currentValue]);
      }
    }, [snapshots, holdings]);

    return (
    <Paper sx={{ p: 2, height: "100%", display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: isDashboard ? 0.5 : 2, fontWeight: 500 }}>
        Portfolio History
      </Typography>

      <Box sx={{ width: '100%', height: isDashboard ? 150 : 200, position: 'relative' }}>
        {seriesData.length > 0 ? (
          <LineChart
            hideLegend
            xAxis={[{ data: xaxisData, scaleType: 'point' }]}
            series={[{ data: seriesData, area: true }]}
            height={200}
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