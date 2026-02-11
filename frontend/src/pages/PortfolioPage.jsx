import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Table, TableContainer, Paper, TableHead, TableCell, TableRow, TableBody } from '@mui/material';
import PortfolioLineGraph from '../components/charts/PortfolioLineGraph.jsx';
import { usePortfolioContext } from '../context/PortfolioContext.jsx';
import { usePortfolios } from '../hooks/usePortfolios.js';
import CreatePortfolioPopOut from '../components/portfolio/CreatePortfolioPopOut.jsx';
import PortfolioDetailed from '../components/portfolio/PortfolioDetailed.jsx';


function PortfolioPage() {
  const { portfolio } = usePortfolioContext();
  const { portfolios, fetchPortfolios } = usePortfolios();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  return (
    <Box sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Header */}
      <Box sx={{ mb: 4, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">Portfolio</Typography>
        <Button onClick={() => setOpen(true)}>Create New Portfolio</Button>
      </Box>

      <CreatePortfolioPopOut
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />

      <Typography variant="body1" sx={{ mb: 4, alignSelf: 'flex-start' }}>
        Welcome to your portfolio page!
      </Typography>

      {/* Portfolio Display */}
      <Grid container spacing={2} justifyContent="center" sx={{ width: '100%' }}>
        {/* Selected portfolio */}
        {portfolio && (
          <Grid sx={{ display: 'flex', justifyContent: 'center' }}>
            <PortfolioDetailed portfolio={portfolio} />
          </Grid>
        )}

        {/* Other portfolios */}
        {(!portfolio && portfolios && portfolios.length > 0) && portfolios.map((p) => (
          <Grid
            key={p.id}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <PortfolioLineGraph portfolio={p} />
          </Grid>
        ))}

        {/* No portfolios */}
        {(!portfolio && (!portfolios || portfolios.length === 0)) && (
          <Typography variant="body2">
            No portfolios found. Please create one to get started.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default PortfolioPage;
