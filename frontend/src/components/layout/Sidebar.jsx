import { Box, Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import vestlyLogo from "../../assets/VestlyImg.png";
import { usePortfolioContext } from "../../context/PortfolioContext.jsx";
 
function Sidebar() {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { setPortfolio } = usePortfolioContext();
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const location = useLocation();
  
 
  const isDark = theme.palette.mode === "dark";
 
  const navItems = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Budget", path: "/budget" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "FAQ", path: "/faq" },
      { label: "About", path: "/about" },
    ],
    []
  );
 
  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
 
  const hoverBg = isDark
    ? "rgba(168, 134, 94, 0.1)"
    : "rgba(111, 90, 69, 0.06)";
 
  const navButtonSx = {
    justifyContent: open ? "flex-start" : "center",
    minHeight: 46,
    width: open ? "100%" : "44px !important",
    maxWidth: open ? "100%" : "44px !important",
    mx: "auto",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    px: open ? 2 : 0,
    borderRadius: 2,
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: hoverBg,
    },
  };
 
  const utilityButtonSx = {
    justifyContent: open ? "flex-start" : "center",
    minHeight: 36,
    width: "100%",
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    px: open ? 1.5 : 0,
    borderRadius: 2,
    fontSize: open ? "0.875rem" : "1rem",
    minWidth: 0,
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: hoverBg,
    },
  };
 
  const sidebarGradient = isDark
    ? "linear-gradient(180deg, #1A1410 0%, #141009 100%)"
    : "linear-gradient(180deg, #F1ECE5 0%, #E9DFD3 100%)";
 
  const utilityCardBg = isDark
    ? "rgba(255, 255, 255, 0.04)"
    : "rgba(255, 255, 255, 0.45)";
 
  const utilityCardBorder = isDark
    ? "1px solid rgba(168, 134, 94, 0.12)"
    : "1px solid rgba(111, 90, 69, 0.12)";
 
  const utilityCardShadow = isDark
    ? "0 4px 10px rgba(0, 0, 0, 0.2)"
    : "0 4px 10px rgba(111, 90, 69, 0.05)";
 
  const utilityAreaBg = isDark
    ? "rgba(0, 0, 0, 0.15)"
    : "rgba(255, 255, 255, 0.22)";
 
  const logoDivider = isDark
    ? "1px solid rgba(168, 134, 94, 0.08)"
    : "1px solid rgba(111, 90, 69, 0.08)";
 
  return (
    <Box
      sx={{
        width: open ? 240 : 64,
        height: "100%",
        overflow: "hidden",
        transition: "width 260ms ease",
        background: sidebarGradient,
        borderRight: `1px solid ${theme.palette.divider}`,
        boxShadow: isDark
          ? "inset -1px 0 0 rgba(168, 134, 94, 0.08)"
          : "inset -1px 0 0 rgba(111, 90, 69, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* TOP */}
      <Box sx={{ p: open ? 2 : 1, boxSizing: "border-box" }}>
        <Button
          variant="outlined"
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            mb: 2,
            width: "100%",
            minWidth: 0,
            px: open ? 2 : 0,
          }}
        >
          {open ? "Collapse" : ">"}
        </Button>
 
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: open ? "stretch" : "center" }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
 
            return (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                variant={active ? "contained" : "text"}
                sx={{
                  ...navButtonSx,
                  "&:hover": {
                    backgroundColor: active ? undefined : hoverBg,
                  },
                }}
                onClick={() => setPortfolio(null)}
              >
                {open ? item.label : item.label[0]}
              </Button>
            );
          })}
        </Box>
      </Box>
 
      {/* BOTTOM UTILITY AREA */}
      <Box
        sx={{
          p: open ? 2 : 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: utilityAreaBg,
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <Box
          sx={{
            border: utilityCardBorder,
            borderRadius: 3,
            p: open ? 1.25 : 1,
            backgroundColor: utilityCardBg,
            boxShadow: utilityCardShadow,
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: open ? "row" : "column",
            alignItems: "center",
            justifyContent: "center",
            gap: open ? 1.25 : 1,
            transition: "background-color 0.2s ease",
          }}
        >
          {/* LOGO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: open ? logoDivider : "none",
              borderBottom: !open ? logoDivider : "none",
              pr: open ? 1 : 0,
              pb: !open ? 1 : 0,
              width: open ? "50%" : "100%",
            }}
          >
            <img
              src={vestlyLogo}
              alt="Vestly Logo"
              style={{
                height: open ? 70 : 36,
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                opacity: isDark ? 0.75 : 0.96,
                filter: isDark ? "brightness(0.85) sepia(0.15)" : "none",
                transition: "height 0.26s ease, opacity 0.2s ease, filter 0.2s ease",
              }}
            />
          </Box>
 
          {/* SETTINGS + LOGOUT */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              justifyContent: "center",
              width: open ? "50%" : "100%",
              minWidth: 0,
            }}
          >
            <Button
              onClick={openMenu}
              variant="text"
              sx={utilityButtonSx}
              startIcon={open ? <SettingsIcon fontSize="small" /> : null}
            >
              {open ? "Settings" : <SettingsIcon fontSize="small" />}
            </Button>
 
            <Button
              variant="text"
              onClick={logout}
              sx={utilityButtonSx}
              startIcon={open ? <LogoutIcon fontSize="small" /> : null}
            >
              {open ? "Logout" : <LogoutIcon fontSize="small" />}
            </Button>
          </Box>
        </Box>
 
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              toggleDarkMode();
              closeMenu();
            }}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
 
export default Sidebar;