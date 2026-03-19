import { Box, Button, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import vestlyLogo from "./VestlyImg.png";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Budget", path: "/budget" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "News", path: "/news" },
      { label: "FAQ", path: "/faq" },
      { label: "About", path: "/about" },
    ],
    []
  );

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const navButtonSx = {
    justifyContent: open ? "flex-start" : "center",
    minHeight: 46,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    px: open ? 2 : 0,
    borderRadius: 2,
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(111, 90, 69, 0.06)",
    },
  };

  const utilityButtonSx = {
    justifyContent: open ? "flex-start" : "center",
    minHeight: 42,
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "clip",
    px: open ? 1.5 : 0,
    borderRadius: 2,
    transition: "background-color 0.2s ease, color 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(111, 90, 69, 0.06)",
    },
  };

  return (
    <Box
      sx={{
        width: open ? 240 : 76,
        transition: "width 260ms ease",
        overflow: "hidden",
        background: "linear-gradient(180deg, #F1ECE5 0%, #E9DFD3 100%)",
        borderRight: `1px solid ${theme.palette.divider}`,
        boxShadow: "inset -1px 0 0 rgba(111, 90, 69, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100%",
      }}
    >
      {/* TOP */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            mb: 2,
            width: "100%",
            minWidth: 0,
          }}
        >
          {open ? "Collapse" : ">"}
        </Button>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                    backgroundColor: active
                      ? undefined
                      : "rgba(111, 90, 69, 0.06)",
                  },
                }}
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
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          background: "rgba(255,255,255,0.22)",
        }}
      >
        <Box
          sx={{
            border: "1px solid rgba(111, 90, 69, 0.12)",
            borderRadius: 3,
            p: 1.25,
            backgroundColor: "rgba(255,255,255,0.45)",
            boxShadow: "0 4px 10px rgba(111, 90, 69, 0.05)",
            minHeight: open ? 108 : 120,
            display: "grid",
            gridTemplateColumns: open ? "1fr 1fr" : "1fr",
            alignItems: "center",
            gap: 1.25,
          }}
        >
          {/* LEFT: LOGO */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: open ? "1px solid rgba(111, 90, 69, 0.08)" : "none",
              pr: open ? 1 : 0,
            }}
          >
            <img
              src={vestlyLogo}
              alt="Vestly Logo"
              style={{
                height: open ? 70 : 52,
                width: "auto",
                objectFit: "contain",
                opacity: 0.96,
              }}
            />
          </Box>

          {/* RIGHT: SETTINGS + LOGOUT */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={openMenu}
              variant="text"
              sx={utilityButtonSx}
              startIcon={open ? <SettingsIcon /> : null}
            >
              {open ? "Settings" : "⚙"}
            </Button>

            <Button
              variant="text"
              onClick={logout}
              sx={utilityButtonSx}
              startIcon={open ? <LogoutIcon /> : null}
            >
              {open ? "Logout" : "↩"}
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