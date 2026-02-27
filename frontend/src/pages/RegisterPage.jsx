import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography, FormControl, InputLabel, Input, Button, FormGroup } from "@mui/material";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(username, firstName, lastName, email, password);
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <Box 
      component={"form"}
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: "auto", mt: 5, gap: 2, display: 'flex', flexDirection: 'column' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>

      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        <FormControl>
          <InputLabel htmlFor="username">Username</InputLabel>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="firstName">First Name</InputLabel>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />  
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="lastName">Last Name</InputLabel>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Button type="submit" variant="contained">Sign Up</Button>
      </Box>

      <Button onClick={() => {
        navigate("/login");
      }} variant="outlined">Go to Login Page</Button>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default RegisterPage;
