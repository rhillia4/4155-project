// pages/About.jsx
import { Box, Typography, Card, CardContent } from "@mui/material";

function AboutPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        About This App
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Overview
          </Typography>
          <Typography variant="body1">
            This platform helps you manage and analyze investment portfolios in
            real time. You can create portfolios, track holdings, view
            performance graphs, and monitor transactions.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Key Features
          </Typography>
          <Typography variant="body1">
            • Create and manage multiple portfolios
            <br />
            • Track stock holdings with live pricing
            <br />
            • View performance snapshots and graphs
            <br />
            • Monitor transactions per portfolio
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Tech Stack
          </Typography>
          <Typography variant="body1">
            React, React Router, Material UI, Axios, and a RESTful backend API.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AboutPage;