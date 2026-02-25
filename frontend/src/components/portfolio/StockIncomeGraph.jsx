import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography } from '@mui/material';
import { useTransactions } from '../../hooks/useTransactions.js';

function StockIncomeGraph({ portfolio }) {
    const { transactions, getTransactions } = useTransactions();
    const [xaxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!portfolio?.id) return;
        setLoading(true);
        getTransactions(portfolio.id).finally(() => setLoading(false));
    }, [portfolio.id]);

    useEffect(() => {
        if (transactions && transactions.length > 0) {
            setXAxisData(transactions.map(tx => tx.date || tx.executed_at));
            
            const deltaChanges = transactions.map((tx, index) => {
                if (index === 0) return 0;
                return tx.value - transactions[index - 1].value;
            });
            setSeriesData(deltaChanges);
        }
    }, [transactions]);

    return (
        <Box sx={{ width: '100%', height: 300 }}>
            {!loading && (
                <LineChart 
                    hideLegend
                    xAxis={[{ data: xaxisData, label: 'Date', scaleType: 'point' }]}
                    yAxis={[{ label: 'Change (USD)' }]}
                    series={[{ data: seriesData, label: 'Daily Profit/Loss', area: true }]}
                    sx={{ width: '100%', height: '100%' }}
                />
            )}
        </Box>
    );
}

export default StockIncomeGraph;