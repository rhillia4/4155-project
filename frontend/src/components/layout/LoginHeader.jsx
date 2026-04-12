import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import vestlyLogo from "../../assets/VestlyImg.png";
 
function LoginHeader() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
 
  const headerGradient = isDark
    ? "linear-gradient(180deg, #1A1410 0%, #141009 100%)"
    : "linear-gradient(180deg, #F4F1EC 0%, #EEE6DD 100%)";
 
  const headerShadow = isDark
    ? "0 2px 6px rgba(0, 0, 0, 0.3)"
    : "0 2px 6px rgba(111, 90, 69, 0.08)";
 
  return (
    <Box
      sx={{
        height: 120,
        px: 3,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: headerGradient,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: headerShadow,
        transition: "background 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <Box
        component={Link}
        to="/login"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1.2,
          textDecoration: "none",
          color: "inherit",
          mb: "8px",
        }}
      >
        <Box
          component="img"
          src={vestlyLogo}
          alt="Vestly Logo"
          sx={{
            height: 100,
            width: "auto",
            objectFit: "contain",
            display: "block",
            opacity: isDark ? 0.8 : 1,
            filter: isDark ? "brightness(0.85) sepia(0.15)" : "none",
            transition: "opacity 0.2s ease, filter 0.2s ease",
          }}
        />
 
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1.1,
            mb: "12px",
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
    </Box>
  );
}
 
export default LoginHeader;