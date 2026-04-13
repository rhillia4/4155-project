import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePortfolioContext } from '../../context/PortfolioContext.jsx';
import { usePortfolio } from '../../hooks/usePortfolio.js';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useHoldings } from '../../hooks/useHoldings.js';
import { usePortfolioSnapshots } from '../../hooks/usePortfolioSnapshot.js';
import BuyTransaction from '../trading/BuyTransaction.jsx';
import SellTransaction from '../trading/SellTransaction.jsx';
import StockIncomeGraph from './StockIncomeGraph.jsx';
import PortfolioHeader from './PortfolioHeader.jsx';
import PortfolioComposition from './PortfolioComposition.jsx';
import HoldingTable from '../tables/HoldingTable.jsx';
import TransactionTable from '../tables/TransactionTable.jsx';

function PortfolioDetailed() {

  const navigate = useNavigate();
  const { portfolio, setPortfolio } = usePortfolioContext();
  const [transactions, setTransactions] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHoldings, setShowHoldings] = useState(true);
  
  
  const { deletePortfolio } = usePortfolio();
  const { getTransactions } = useTransactions(); 
  const { getHoldings } = useHoldings(); 
  const { getPortfolioSnapshotDetails } = usePortfolioSnapshots();

  const toggleView = () => {
    setShowHoldings(prev => !prev);
  };

  const refreshData = async () => {
    const [newTransactions, newHoldings] = await Promise.all([
      getTransactions(portfolio.id),
      getHoldings(portfolio.id)
    ]);
    console.log('Refreshed Transactions:', newHoldings);
    setTransactions(newTransactions);
    setHoldings(newHoldings);
  };
  
  useEffect(() => {
    if (!portfolio?.id) return;
    
    const loadData = async () => {
      setLoading(true);
      
      try {
        const [newTransactions, newHoldings, newSnapshots] = await Promise.all([
          getTransactions(portfolio.id),
          getHoldings(portfolio.id),
          getPortfolioSnapshotDetails(portfolio.id),
        ]);
        console.log('Refreshed Transactions:', newHoldings);
        setTransactions(newTransactions);
        setHoldings(newHoldings);
        setSnapshots(newSnapshots);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [portfolio?.id]);

  return (
    <Box sx={{ width: '100%', minHeight: '100%', p: { xs: 1, md: 3 }, }}> {/* Full width & height of parent */}
      
      <PortfolioHeader holdings={holdings} />

      <Grid container spacing={{ xs: 1, md: 2 }} sx={{ width: '100%', mt: 2, justifyContent: 'center'}}>
        <Grid item xs={12} md={6} sx={{ height: { xs: '300px', md: '400px'} }}> 
          <StockIncomeGraph snapshots={snapshots} holdings={holdings} />
        </Grid>
        
        <Grid item xs={12} md={6} sx={{ height: { xs: '300px', md: '400px' } }}> 
          <PortfolioComposition holdings={holdings} />
        </Grid>
      </Grid>
     
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', mt: 2, justifyContent: 'space-between' }}>
        <Typography variant="h5" component="div" sx={{ mt: 2, textAlign: 'center' }}>
            {portfolio.name}
        </Typography>
        <Button 
          onClick={async () => {
            try {
              await deletePortfolio(portfolio.id);
              window.location.reload();
              setPortfolio(null);
              navigate('/portfolio');
            } catch (error) {
              console.error("Error deleting portfolio:", error);
            }
          }} 
          sx={{}}
          >
          Delete Portfolio
        </Button>
        <Button onClick={() => setBuyOpen(true)} sx={{}}>
          Buy Position
        </Button>
        <Button onClick={() => setSellOpen(true)} sx={{}} disabled={holdings.length === 0}>
          Sell Position
        </Button>
      </Box>

        <BuyTransaction
          portfolioId={portfolio.id}
          open={buyOpen}
          onClose={() => {
            setBuyOpen(false);
            refreshData();
          }}
        />
        <SellTransaction
          portfolioId={portfolio.id}
          holdings={holdings}
          open={sellOpen}
          onClose={() => {
            setSellOpen(false);
            refreshData();
          }}
        />

        {/* Table */}
         <Box sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {!showHoldings ? "Transactions" : "Holdings"} for {portfolio.name}
            </Typography>
            <Button variant="text" onClick={toggleView} sx={{ mb: 1 }}>
              Switch to {showHoldings ? "Transactions" : "Holdings"}
            </Button>
            {showHoldings ? <HoldingTable holdings={holdings} /> : <TransactionTable transactions={transactions} />}
        </Box>
      </Box>
  );
}

export default PortfolioDetailed;