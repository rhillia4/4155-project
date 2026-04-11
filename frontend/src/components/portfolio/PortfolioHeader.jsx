import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

function PortfolioHeader({ holdings }) {
  const stats = useMemo(() => {
    if (!holdings || holdings.length === 0) return { investment: 0, positions: 0 };
    const investment = holdings.reduce((sum, h) => sum + (h.remaining_shares * h.buy_price), 0);
    // Counting unique symbols using a Set
    const positions = new Set(holdings.map(h => h.asset.symbol)).size;

    const roi = holdings.reduce((sum, h) => {
      const currentValue = parseInt(h.remaining_shares) * parseFloat(h.current_price);
      const cost = parseInt(h.remaining_shares) * parseFloat(h.buy_price);
      return sum + (currentValue - cost);
    }, 0);
    return { investment, positions, roi };
  }, [holdings]);

  const cardStyle = { p: 2, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider'};

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">PORTFOLIO VALUE</Typography>
        {/* just matching investment until live prices are added */}
        <Typography variant="h6">${stats.investment.toLocaleString()}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">YOUR INVESTMENT</Typography>
        <Typography variant="h6">${stats.investment.toLocaleString()}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">TOTAL POSITIONS</Typography>
        <Typography variant="h6">{stats.positions}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">ROI</Typography>
        <Typography variant="h6">{stats.roi}%</Typography>
      </Paper></Grid>
    </Grid>
  );
}
export default PortfolioHeader;