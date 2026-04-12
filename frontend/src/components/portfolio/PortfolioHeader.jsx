import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

function PortfolioHeader({ holdings }) {
  const stats = useMemo(() => {
    if (!holdings || holdings.length === 0) return { investment: 0, positions: 0 };
    const totalValue = holdings.reduce((sum, h) => sum + (h.value), 0);
    const investment = holdings.reduce((sum, h) => sum + (h.remaining_shares * h.buy_price), 0);
    // Counting unique symbols using a Set
    const positions = new Set(holdings.map(h => h.asset.symbol)).size;

    const roi = holdings.reduce((sum, h) => {
      const currentValue = parseFloat(h.remaining_shares) * parseFloat(h.latest_price);
      const cost = parseFloat(h.remaining_shares) * parseFloat(h.buy_price);
      return sum + (currentValue - cost);
    }, 0);
    return { totalValue, investment, positions, roi };
  }, [holdings]);

  const cardStyle = { p: 2, textAlign: 'center', borderRadius: 2, border: '1px solid', borderColor: 'divider'};

  return (
    <Grid container spacing={2} sx={{ gap: 4, mb: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">PORTFOLIO VALUE</Typography>
        {/* just matching investment until live prices are added */}
        <Typography variant="h6">${parseFloat(stats.totalValue).toFixed(2)}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">YOUR INVESTMENT</Typography>
        <Typography variant="h6">${parseFloat(stats.investment).toFixed(2)}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">TOTAL POSITIONS</Typography>
        <Typography variant="h6">{stats.positions}</Typography>
      </Paper></Grid>
      <Grid ><Paper sx={cardStyle}>
        <Typography variant="caption" color="textSecondary">ROI</Typography>
        <Typography variant="h6">{parseFloat(stats.roi).toFixed(2)}%</Typography>
      </Paper></Grid>
    </Grid>
  );
}
export default PortfolioHeader;