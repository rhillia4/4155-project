import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, FormControl, InputLabel, Input, Button, FormGroup} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LoginHeader from "../components/layout/LoginHeader.jsx";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark"; 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LoginHeader />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          width: "100%",
          mx: "auto",
          mt: 6,
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
        >
          Sign In
        </Typography>

        <FormControl variant="standard">
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>

        <FormControl variant="standard">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button type="submit" variant="contained" sx={{ mt: 1 }}>Login</Button>
 
        <Button onClick={() => navigate("/register")}variant="outlined">Go to Sign Up Page</Button>
 
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
 
export default LoginPage;