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
import vestlyLogo from "../../assets/VestlyImg.png";
 
function Header() {
  const { user } = useAuth();
  const theme = useTheme();
 
  const isDark = theme.palette.mode === "dark";
 
  const [anchorEl, setAnchorEl] = useState(null);
 
  const toggleMenu = (e) => {
    setAnchorEl((prev) => (prev ? null : e.currentTarget));
  };
 
  const closeMenu = () => setAnchorEl(null);
 
  const firstName = user?.first_name || user?.username || "User";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const firstInitial = displayName.charAt(0);
 
  // Theme-aware gradient for header
  const headerGradient = isDark
    ? "linear-gradient(180deg, #1A1410 0%, #141009 100%)"
    : "linear-gradient(180deg, #F4F1EC 0%, #EEE6DD 100%)";
 
  // Theme-aware shadow
  const headerShadow = isDark
    ? "0 2px 6px rgba(0, 0, 0, 0.3)"
    : "0 2px 6px rgba(111, 90, 69, 0.08)";
 
  // Theme-aware avatar/hover tints
  const avatarBg = isDark
    ? "rgba(168, 134, 94, 0.18)"
    : "rgba(111, 90, 69, 0.16)";
 
  const avatarBorder = isDark
    ? "1px solid rgba(168, 134, 94, 0.22)"
    : "1px solid rgba(111, 90, 69, 0.18)";
 
  const hoverBg = isDark
    ? "rgba(168, 134, 94, 0.1)"
    : "rgba(111, 90, 69, 0.06)";
 
  const hoverShadow = isDark
    ? "0 1px 2px rgba(0, 0, 0, 0.2)"
    : "0 1px 2px rgba(111, 90, 69, 0.06)";
 
  return (
    <Box
      sx={{
        height: 120,
        px: 3,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        background: headerGradient,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: headerShadow,
        transition: "background 0.2s ease, box-shadow 0.2s ease",
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
            height: 120,
            width: "auto",
            objectFit: "contain",
            display: "block",
            cursor: "pointer",
            mt: "2px",
            opacity: isDark ? 0.8 : 1,
            filter: isDark ? "brightness(0.85) sepia(0.15)" : "none",
            transition: "transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease",
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
            mb: "20px",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Great Vibes", "Times New Roman", cursive',
              fontSize: "2rem",
              color: theme.palette.primary.main,
              transition: "color 0.2s ease",
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
              transition: "color 0.2s ease",
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
          pb: "20px",
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
              backgroundColor: hoverBg,
              boxShadow: hoverShadow,
            },
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              backgroundColor: avatarBg,
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: "1rem",
              border: avatarBorder,
              transition: "background-color 0.2s ease, border 0.2s ease",
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
                transition: "color 0.2s ease",
              }}
            >
              Welcome, {displayName}
            </Typography>
 
            <Typography
              sx={{
                fontSize: "0.78rem",
                letterSpacing: "0.05em",
                color: theme.palette.text.secondary,
                transition: "color 0.2s ease",
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
          <MenuItem disabled>{displayName}</MenuItem>
          <MenuItem disabled>Profile</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
 
export default Header;