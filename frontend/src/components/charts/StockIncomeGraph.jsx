import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePortfolioContext } from '../../context/PortfolioContext.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import axios from 'axios';

function StockIncomeGraph({ portfolio }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { setPortfolio } = usePortfolioContext();
    const { transactions, getTransactions } = useTransactions();
    const [xaxisData, setXAxisData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!portfolio?.id) return;
        setLoading(true);
        try {
            getTransactions(portfolio.id);
            setXAxisData(transactions.map(tx => tx.date));
            const deltaChanges = transactions.map((tx, index) => {
                if (index === 0) return 0;
                return tx.value - transactions[index - 1].value;
            });
            setSeriesData(deltaChanges);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [transactions]);

    return (
        <Card sx={{ width: '100%', height: '100%' }}> {/* Full width & height of parent */}
          <CardActionArea
            onClick={() => {
              setPortfolio(portfolio);
              navigate(`/portfolio`);
            }}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
          >
            <CardContent sx={{ width: '100%', height: '100%' }}>
                {!loading && (
                    <LineChart 
                        hideLegend
                        xAxis={[{ data: xaxisData, label: 'Date' }]}
                        yAxis={ [{ label: 'Change (USD)' }] }
                        grid={{ horizontal: true }}
                        series={[{ data: seriesData, label: 'Daily Profit/Loss', area: true}]}
                        sx={{ width: '100%', height: 300 }} // Chart scales to card width
                    />
                )}
                <Typography variant="h5" component="div" sx={{ mt: 2, textAlign: 'center' }}>
                    {portfolio.name}
                </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
    );
}

export default StockIncomeGraph;



          