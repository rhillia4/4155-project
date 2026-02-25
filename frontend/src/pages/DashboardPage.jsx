import React, { useEffect, useState } from "react";
import { Box, List, Typography } from "@mui/material";
import PortfolioLineGraph from "../components/charts/PortfolioLineGraph.jsx";
import { usePortfolios } from "../hooks/usePortfolios.js";
import StockIncomeGraph from "../components/charts/StockIncomeGraph.jsx";

function DashboardPage() {
  const { portfolios, fetchPortfolios } = usePortfolios();
    
  useEffect(() => {
    fetchPortfolios();
  }, []);

  console.log("Portfolios:", portfolios, "hello world"); // Debugging log
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard!
      </Typography>

      <List sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2, mt: 2 }}>
        {portfolios && portfolios.length > 0 ? (
          portfolios.map((portfolio) => (
            <PortfolioLineGraph key={portfolio.id} portfolio={portfolio} />
          ))
        ) : (
        <Typography variant="body2">
          No portfolios found. Please create one to get started.
        </Typography>
      )}
      </List>
    </Box>
  );
}
export default DashboardPage;