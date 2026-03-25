import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";
 
function Layout() {
  const theme = useTheme();
 
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header — fixed at top, never scrolls */}
      <Box sx={{ flexShrink: 0, zIndex: 1100 }}>
        <Header />
      </Box>
 
      {/* Body row — fills remaining height */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
 
        {/* Sidebar — never scrolls */}
        <Box sx={{ flexShrink: 0, zIndex: 1000 }}>
          <Sidebar />
        </Box>
 
        {/* Main content — only this scrolls */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
 
      </Box>
    </Box>
  );
}
 
export default Layout;