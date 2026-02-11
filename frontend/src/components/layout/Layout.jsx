import React from "react";
import Navbar from "./Navbar";
import {Outlet} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import { Box } from "@mui/material";

function Layout() {
    const {user} = useAuth();
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />  
            {user ? <Outlet /> : null}
        </Box>
    );
}
export default Layout;