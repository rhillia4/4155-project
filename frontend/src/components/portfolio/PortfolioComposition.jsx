import React, { useMemo, useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, Paper } from '@mui/material';
import { getStockData } from '../../services/api.js';

function PortfolioComposition({ holdings }) {
  const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!holdings?.length) return;

        const fetchData = async () => {
            const updatedRows = [];

            for (const holding of holdings) {
                if (!holding.asset?.symbol) continue;

                try {
                    const response = await getStockData(holding.asset.symbol);
                    const data = response.data || [];

                    if (data.length === 0) continue;

                    const latest = data.reduce((latestItem, current) => {
                        return new Date(current.date) > new Date(latestItem.date)
                            ? current
                            : latestItem;
                    }, data[0]);

                    const latestPrice = Number(latest.price) || 0;

                    updatedRows.push({
                        ...holding,
                        latest_price: latestPrice
                    });

                } catch (error) {
                    console.error("Error fetching stock data:", error);
                }
            }


            setRows(updatedRows.sort((a, b) => a.asset.symbol.localeCompare(b.asset.symbol)));
        };

        fetchData();
    }, [holdings]);


  const chartData = useMemo(() => {
    if (!rows.length) return [];
    const totals = rows.reduce((acc, h) => {
      acc[h.asset.symbol] = (acc[h.asset.symbol] || 0) + (Number(h.remaining_shares) * Number(h.latest_price) || 0);
      return acc;
    }, {});
    return Object.keys(totals).map((symbol, i) => ({ id: i, value: totals[symbol], label: symbol }));
  }, [rows]);

  return (
    <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider',height: '350' }}>
      <Typography variant="h6" color="white">Portfolio Composition</Typography>
      <Box sx={{ height: 250, mt: 2 }}>
        <PieChart series={[{ 
            data: chartData,
            innerRadius: 30,
            outerRadius: 80,
          }]} 
      />
      </Box>
    </Paper>
  );
}
export default PortfolioComposition;