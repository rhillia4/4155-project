import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

function PortfolioHeader({ transactions }) {
  const stats = useMemo(() => {
    if (!transactions || transactions.length === 0) return { investment: 0, positions: 0 };
    const investment = transactions.reduce((sum, t) => sum + (t.shares * t.price), 0);
    // Counting unique symbols using a Set
    const positions = new Set(transactions.map(t => t.asset.symbol)).size;
    return { investment, positions };
  }, [transactions]);

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