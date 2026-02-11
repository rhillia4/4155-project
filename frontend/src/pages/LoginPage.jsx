import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, FormControl, InputLabel, Input, Button, FormGroup } from "@mui/material";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

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
      component={"form"}
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 5, gap: 2, display: 'flex', flexDirection: 'column' }}
      >
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box onSubmit={handleSubmit} sx={{ gap: 2, display: 'flex', flexDirection: 'column'}}>
        <FormControl>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button type="submit" variant="contained">Login</Button>

      </Box>

      <Button onClick={() => {
        navigate("/register");
      }} variant="outlined">Go to Sign Up Page</Button>


      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default LoginPage;
