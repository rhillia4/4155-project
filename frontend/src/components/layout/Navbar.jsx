/*import { AppBar, Button, Toolbar, Typography, Box, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { usePortfolioContext } from "../../context/PortfolioContext.jsx";
import ThemeToggleButton from "./ThemeToggleButton.jsx";
import React from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const { setPortfolio } = usePortfolioContext();
  const theme = useTheme();

  const navButtonStyle = {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",       // slightly bigger
    padding: "6px 16px",    // slightly taller/wider
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  };

  return (
    <AppBar position="static" sx={{ height: 72, justifyContent: "center", boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Left side: Logo + Navigation buttons }
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: "bold",
              color: theme.palette.text.primary,
              textDecoration: "none",
            }}
          >
            Vestly
          </Typography>

          {user && (
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                component={Link}
                to="/dashboard"
                onClick={() => requestAnimationFrame(() => setPortfolio(null))}
                sx={navButtonStyle}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/portfolio"
                onClick={() => requestAnimationFrame(() => setPortfolio(null))}
                sx={navButtonStyle}
              >
                Portfolio
              </Button>
              <Button
                component={Link}
                to="/budget"
                onClick={() => requestAnimationFrame(() => setPortfolio(null))}
                sx={navButtonStyle}
              >
                Budget
              </Button>
              {/* New buttons }
              <Button component={Link} to="/news" sx={navButtonStyle}>
                News
              </Button>
              <Button component={Link} to="/faq" sx={navButtonStyle}>
                FAQ
              </Button>
              <Button component={Link} to="/about" sx={navButtonStyle}>
                About Us
              </Button>
            </Box>
          )}
        </Box>

        {/* Right side: User info, theme toggle, logout }
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                Welcome, {user.username}
              </Typography>
              <ThemeToggleButton />
              <Button
                onClick={logout}
                sx={{
                  ...navButtonStyle,
                  backgroundColor: theme.palette.error.main,
                  color: "#fff",
                  "&:hover": { backgroundColor: theme.palette.error.dark },
                }}
              >
                Logout
              </Button>
            </>
          )}
          {!user && (
            <Button component={Link} to="/login" sx={navButtonStyle}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
*/