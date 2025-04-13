import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Container,
  Link,
  Alert,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(username, password);
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm' sx={{ textAlign: "center" }}>
      <Box
      component="img"
      src="/Logo.png"
      alt="Logo"
      sx={{
        // Use different widths for various breakpoints
        width: {
          xs: "100%",  // Extra-small screens: Take up full container width
          sm: "80%",   // Small screens: 80% of container
          md: "60%",   // Medium screens: 60% of container
          lg: "400px", // Large screens: fixed width of 400px
          xl: "400px", // Extra-large screens: fixed width of 500px
        },
        height: "auto",  // Maintain aspect ratio
        mx: "auto",      // Center the image horizontally if the container is wider
      }}
    />

      <Box component='form' onSubmit={handleSubmit} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Username Field */}
        <TextField
          placeholder='USERNAME'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          variant='outlined'
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontFamily: '"Montserrat", sans-serif',
              color: "#102cc2",
            }, 
            "& fieldset": {
              borderColor: "#5F70C8", // default border color
            },
            width: "70%"
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon sx={{ color: "#5F70C8" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Password Field */}
        <TextField
          fullWidth
          placeholder='PASSWORD'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant='outlined'
          sx={{ 
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontFamily: '"Montserrat", sans-serif',
              color: "#102cc2"
            }, 
            "& fieldset": {
              borderColor: "#5F70C8", // default border color
            }, 
            width: "70%"
           }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockOutlinedIcon sx={{ color: "#5F70C8" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Login Button */}
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={loading}
          sx={{
            mt: 1,
            mb: 2,
            bgcolor: "#5F70C8",
            color: "white",
            "&:hover": {
              bgcolor: "#5A78B0",
            },
            fontFamily: '"Montserrat", sans-serif',
            width: "70%"
          }}>
          LOGIN
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
