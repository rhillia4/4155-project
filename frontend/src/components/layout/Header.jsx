import {
    Box,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    useTheme,
  } from "@mui/material";
  import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
  import { useAuth } from "../../context/AuthContext.jsx";
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import vestlyLogo from "./VestlyImg.png";
  
  function Header() {
    const { user } = useAuth();
    const theme = useTheme();
  
    const [anchorEl, setAnchorEl] = useState(null);
  
    const toggleMenu = (e) => {
        setAnchorEl((prev) => (prev ? null : e.currentTarget));
      };
      
      const closeMenu = () => setAnchorEl(null);
  
    const firstName = user?.firstName || user?.username || "User";
    const firstInitial = firstName.charAt(0).toUpperCase();
  
    return (
      <Box
        sx={{
          height: 155,
          px: 3,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          background: "linear-gradient(180deg, #F4F1EC 0%, #EEE6DD 100%)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 2px 6px rgba(111, 90, 69, 0.08)",
        }}
      >
        {/* LEFT SIDE: Clickable logo + brand text */}
        <Box
          component={Link}
          to="/dashboard"
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: 1.2,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            component="img"
            src={vestlyLogo}
            alt="Vestly Logo"
            sx={{
              height: 150,
              width: "auto",
              objectFit: "contain",
              display: "block",
              cursor: "pointer",
              mt: "2px",
              transition: "0.2s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          />
  
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              lineHeight: 1.1,
              mb: "38px",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Great Vibes", "Times New Roman", cursive',
                fontSize: "2rem",
                color: theme.palette.primary.main,
              }}
            >
              Vestly
            </Typography>
  
            <Typography
              sx={{
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                mt: "-2px",
                color: theme.palette.text.secondary,
              }}
            >
              Trusted in Finance since January 12
            </Typography>
          </Box>
        </Box>
  
        {/* RIGHT SIDE: Account area */}
        <Box
  sx={{
    pr: 2,
    pb: "36px",
    display: "flex",
    alignItems: "center",
  }}
>
  <Box
    onClick={toggleMenu}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      cursor: "pointer",
      px: 1,
      py: 0.5,
      borderRadius: 2,
      transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        backgroundColor: "rgba(111, 90, 69, 0.05)",
        boxShadow: "0 1px 2px rgba(111, 90, 69, 0.06)",
      },
    }}
  >
    <Avatar
      sx={{
        width: 38,
        height: 38,
        backgroundColor: "rgba(111, 90, 69, 0.16)",
        color: theme.palette.primary.main,
        fontWeight: 700,
        fontSize: "1rem",
        border: "1px solid rgba(111, 90, 69, 0.18)",
      }}
    >
      {firstInitial}
    </Avatar>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        lineHeight: 1.05,
      }}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          color: theme.palette.text.primary,
        }}
      >
        Welcome, {firstName}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.78rem",
          letterSpacing: "0.05em",
          color: theme.palette.text.secondary,
        }}
      >
        Account
      </Typography>
    </Box>

    <IconButton
      size="small"
      sx={{
        color: theme.palette.text.secondary,
        ml: 0.25,
        pointerEvents: "none",
      }}
    >
      <KeyboardArrowDownIcon fontSize="small" />
    </IconButton>
  </Box>

  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={closeMenu}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <MenuItem disabled>{firstName}</MenuItem>
    <MenuItem disabled>Profile</MenuItem>
  </Menu>
</Box>
      </Box>
    );
  }
  
  export default Header;
 