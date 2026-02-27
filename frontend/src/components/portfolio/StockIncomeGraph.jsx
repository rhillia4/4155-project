import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';

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
        <Box sx={{ width: '100%', height: 300 }}>
            {seriesData.length > 0 ? (
                <LineChart 
                    hideLegend
                    xAxis={[{ data: xaxisData, label: 'Date', scaleType: 'point' }]}
                    yAxis={[{ label: 'Change (USD)' }]}
                    series={[{ data: seriesData, label: 'Daily Profit/Loss', area: true }]}
                    sx={{ width: '100%', height: '100%' }}
                />
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="textSecondary">No transaction history available</Typography>
                </Box>
            )}
        </Box>
    );
}

export default StockIncomeGraph;