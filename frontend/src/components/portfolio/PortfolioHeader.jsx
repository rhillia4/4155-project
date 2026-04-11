import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

function PortfolioHeader({ holdings }) {
  const stats = useMemo(() => {
    if (!holdings || holdings.length === 0) return { investment: 0, positions: 0 };
    const investment = holdings.reduce((sum, h) => sum + (h.shares * h.buy_price), 0);
    // Counting unique symbols using a Set
    const positions = new Set(holdings.map(h => h.asset_symbol)).size;
    return { investment, positions };
  }, [holdings]);

  const cardStyle = { p: 2, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider'};

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={2.4}><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">PORTFOLIO VALUE</Typography>
        {/* just matching investment until live prices are added */}
        <Typography variant="h6">${stats.investment.toLocaleString()}</Typography>
      </Paper></Grid>
      <Grid item xs={3}><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">YOUR INVESTMENT</Typography>
        <Typography variant="h6">${stats.investment.toLocaleString()}</Typography>
      </Paper></Grid>
      <Grid item xs={3}><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">TOTAL POSITIONS</Typography>
        <Typography variant="h6">{stats.positions}</Typography>
      </Paper></Grid>
      <Grid item xs={3}><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">DAY CHANGE</Typography>
        <Typography variant="h6">--</Typography>
      </Paper></Grid>
      <Grid item xs={3}><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">ROI</Typography>
        <Typography variant="h6">--%</Typography>
      </Paper></Grid>
    </Grid>
  );
}
export default PortfolioHeader;