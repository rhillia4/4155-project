import React, { use, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  useMediaQuery
} from '@mui/material';

import { usePortfolioContext } from '../context/PortfolioContext.jsx';
import { usePortfolios } from '../hooks/usePortfolios.js';

import CreatePortfolioPopOut from '../components/portfolio/CreatePortfolioPopOut.jsx';
import PortfolioDetailed from '../components/portfolio/PortfolioDetailed.jsx';
import StockIncomeGraph from '../components/portfolio/StockIncomeGraph.jsx';

// assumed external functions (make sure these exist/imported)
import { useHoldings } from '../hooks/useHoldings.js';
import { usePortfolioSnapshots } from '../hooks/usePortfolioSnapshot.js';

function PortfolioPage() {
  const { portfolio, setPortfolio } = usePortfolioContext();
  const [portfolios, setPortfolios] = useState([]);
  
  const [open, setOpen] = useState(false);
  const [enrichedPortfolios, setEnrichedPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {fetchPortfolios } = usePortfolios();
  const { getPortfolioSnapshotDetails } = usePortfolioSnapshots(null);
  const { getHoldings } = useHoldings(null);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
    };

  // Load portfolios once
  useEffect(() => {
    const loadPortfolios = async () => {
      const data = await fetchPortfolios();
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name)); 
      setPortfolios(sorted);
    };
    loadPortfolios();
  }, []);

  useEffect(() => {
    // refresh data when portfolio changes
    if (!portfolio) return;
  }, [portfolio]);
  // Enrich portfolios with holdings + snapshots
  useEffect(() => {
    if (!portfolios?.length) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const enriched = await Promise.all(
          portfolios.map(async (p) => {
            const [holdings, snapshots] = await Promise.all([
              getHoldings(p.id),
              getPortfolioSnapshotDetails(p.id),
            ]);

            return {
              ...p,
              holdings,
              snapshots,
            };
          })
        );
        setEnrichedPortfolios(enriched);
      } catch (err) {
        setError(err.message || 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [portfolios]);


  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem'}}}>
          Portfolio
        </Typography>

        <Button onClick={() => setOpen(true)} variant="contained"
        size={useMediaQuery('(max-width:600px)') ? "small" : "medium"} // Smaller button on mobile
        sx={{ whiteSpace: 'nowrap', minWidth: 'fit-content' }}>
          Create New Portfolio
        </Button>
      </Box>

      <CreatePortfolioPopOut
        open={open}
        onClose={() => handleClose()}
      />

      <Typography variant="body1" sx={{ mb: 4, alignSelf: 'flex-start' }}>
        Welcome to your portfolio page!
      </Typography>

      {loading && (
        <Typography sx={{ mb: 2 }}>Loading portfolios...</Typography>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Portfolio Display */}
      <Grid container spacing={2} justifyContent="center" sx={{ width: '100%' }}>
        {/* Selected portfolio */}
        {portfolio && (
          <Grid sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <PortfolioDetailed onClose={() => handleClose()} />
          </Grid>
        )}

        {/* Portfolio list */}
        {!portfolio &&
          enrichedPortfolios &&
          enrichedPortfolios.length > 0 &&
          enrichedPortfolios.map((p) => (
            <Grid
              key={p.id}
              sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}
            >
              <Card sx={{ width: '100%', height: '100%' }}>
                <CardActionArea
                  onClick={() => setPortfolio(p)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                    {p.name}
                  </Typography>
                  <CardContent sx={{ width: '100%', height: '100%' }}>
                    <StockIncomeGraph
                      snapshots={p.snapshots}
                      holdings={p.holdings}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}

        {/* Empty state */}
        {!portfolio &&
          (!enrichedPortfolios || enrichedPortfolios.length === 0) &&
          !loading && (
            <Typography variant="body2">
              No portfolios found. Please create one to get started.
            </Typography>
          )}
      </Grid>
    </Box>
  );
}

export default PortfolioPage;