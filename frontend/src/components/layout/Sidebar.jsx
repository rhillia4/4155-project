import { Box, Button, Menu, MenuItem, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import SettingsIcon from "@mui/icons-material/Settings";
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

  return (
    <Box
      sx={{
        width: open ? 240 : 76,
        transition: "background-color 0.2s ease, color 0.2s ease",
        "&:hover": {
        backgroundColor: "rgba(111, 90, 69, 0.06)",
        },
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
                  justifyContent: open ? "flex-start" : "center",
                  minHeight: 46,
                  width: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "clip",
                  px: open ? 2 : 0,
                  borderRadius: 2,
                }}
              >
                {open ? item.label : item.label[0]}
              </Button>
            );
          })}

          {/* Settings */}
          <Button
            onClick={openMenu}
            variant="text"
            sx={{
              justifyContent: open ? "flex-start" : "center",
              minHeight: 46,
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "clip",
              px: open ? 2 : 0,
              borderRadius: 2,
            }}
            startIcon={open ? <SettingsIcon /> : null}
          >
            {open ? "Settings" : "⚙"}
          </Button>

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

      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          flexDirection: open ? "row" : "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            width: "100%",
          }}
        >
          <img
            src={vestlyLogo}
            alt="Vestly Logo"
            style={{
              height: open ? 72 : 52,
              width: "auto",
              objectFit: "contain",
              opacity: 0.95,
            }}
          />
        </Box>

        <Button
          variant="outlined"
          onClick={logout}
          sx={{
            minWidth: open ? 92 : 40,
            px: open ? 2 : 0,
            width: open ? "auto" : "100%",
          }}
        >
          {open ? "Logout" : "↩"}
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;