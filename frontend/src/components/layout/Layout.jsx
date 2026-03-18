import { Box, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function Layout() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Header />

      <Box sx={{ display: "flex", minHeight: "calc(100vh - 120px)" }}>
        <Sidebar />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;