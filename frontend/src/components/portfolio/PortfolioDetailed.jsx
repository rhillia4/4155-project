import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePortfolioContext } from '../../context/PortfolioContext.jsx';
import { usePortfolio } from '../../hooks/usePortfolio.js';
import { useTransactions } from '../../hooks/useTransactions.js';
import axios from 'axios';
import Transaction from '../trading/Transaction.jsx';
import StockIncomeGraph from './StockIncomeGraph.jsx';
function PortfolioDetailed({ portfolio }) {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setPortfolio } = usePortfolioContext();
  const { deletePortfolio } = usePortfolio();
  const { transactions, getTransactions } = useTransactions(); 
  const [xaxisData, setXAxisData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      if (!portfolio?.id) return;
      setLoading(true);
      try {
        getTransactions(portfolio.id);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
  }, [portfolio.id]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}> {/* Full width & height of parent */}
      
      <Box sx={{ display: 'flex', gap: 5, mb: 3, p: 2, borderBottom: '1px solid #eee' }}>
        <Box>
          <Typography variant="caption" color="textSecondary">YOUR INVESTMENT</Typography>
          <Typography variant="h6">$0.00</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">CURRENT VALUE</Typography>
          <Typography variant="h6">$0.00</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="textSecondary">ROI</Typography>
          <Typography variant="h6" sx={{ color: 'green' }}>0.00%</Typography>
        </Box>
      </Box>

      <StockIncomeGraph transactions={transactions} />
     
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2, justifyContent: 'space-between' }}>
        <Typography variant="h5" component="div" sx={{ mt: 2, textAlign: 'center' }}>
            {portfolio.name}
        </Typography>
        <Button 
          onClick={async () => {
            try {
              await deletePortfolio(portfolio.id);
              setPortfolio(null);
              navigate('/portfolio');
              window.location.reload();

            } catch (error) {
              console.error("Error deleting portfolio:", error);
            }
          }} 
          sx={{}}
          >
          Delete Portfolio
        </Button>
        <Button onClick={() => setOpen(true)} sx={{}}>
          Buy Position
        </Button>
      </Box>

      <Transaction
        portfolioId={portfolio.id}
        open={open}
        onClose={() => {
          setOpen(false);
          getTransactions(portfolio.id);
        }}
      />

    {/* Table */}
      <Typography variant="h5" component="h2" sx={{ mt: 4, alignSelf: 'flex-start' }}>
        Transactions for {portfolio.name}
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 4, width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Shares</TableCell>
              <TableCell>Value(Per Share)</TableCell>
              <TableCell>Total Value</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { transactions?.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.asset.symbol}</TableCell>
                <TableCell>{t.shares}</TableCell>
                <TableCell>{t.price}</TableCell>
                <TableCell>{t.shares * t.price}</TableCell>
                <TableCell>{t.transaction_type}</TableCell>
                <TableCell>{t.executed_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PortfolioDetailed;