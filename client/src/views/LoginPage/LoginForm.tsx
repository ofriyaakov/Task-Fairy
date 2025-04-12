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
    <Container maxWidth='xs' sx={{ pt: 4, textAlign: "center" }}>
      <img src='/Logo.png' alt='Logo' />

      <Box component='form' onSubmit={handleSubmit}>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Username Field */}
        <TextField
          fullWidth
          placeholder='USERNAME'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          variant='outlined'
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon sx={{ color: "#6B8CC8" }} />
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
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockOutlinedIcon sx={{ color: "#6B8CC8" }} />
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
            bgcolor: "#6B8CC8",
            color: "white",
            "&:hover": {
              bgcolor: "#5A78B0",
            },
          }}>
          LOGIN
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
