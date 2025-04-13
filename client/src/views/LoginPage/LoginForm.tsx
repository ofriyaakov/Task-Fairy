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
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError("Invalid email or password");
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
        width: {
          xs: "100%",
          sm: "80%",
          md: "60%",
          lg: "400px",
          xl: "400px",
        },
        height: "auto",
        mx: "auto",
      }}
    />

      <Box component='form' onSubmit={handleSubmit} sx={{ fontFamily: '"Montserrat", sans-serif' }}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Email Field */}
        <TextField
          placeholder='EMAIL'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
