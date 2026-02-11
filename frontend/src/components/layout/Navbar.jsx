import {AppBar, Button, Toolbar, Typography, Box} from "@mui/material";
import {Link} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {usePortfolioContext} from "../../context/PortfolioContext.jsx";
import React from "react";

function Navbar() {
  const {user, logout} = useAuth();
  const {setPortfolio} = usePortfolioContext();
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    <Link to="/" style={{color: 'inherit', textDecoration: 'none'}}>
                        MyApp
                    </Link>
                </Typography>
                {user ? (
                    <>
                        <Box sx={{ mr: 8, gap: 2, display: 'flex', alignItems: 'center' }}>
                            <Button component={Link} to="/" onClick={()=>{
                                requestAnimationFrame(() => {
                                    setPortfolio(null);
                                });
                            }}>
                                Dashboard
                            </Button>
                            <Button component={Link} to="/portfolio" onClick={()=>{
                                requestAnimationFrame(() => {
                                    setPortfolio(null);
                                });
                            }}>
                                Portfolios
                            </Button>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1" sx={{marginRight: 2}}>
                                Welcome, {user.username}
                            </Typography>
                            <Button onClick={logout}>
                                Logout
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Button component={Link} to="/login">
                        Login
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
export default Navbar;