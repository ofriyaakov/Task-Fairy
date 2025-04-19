import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  InputAdornment,
  Container,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email && !emailRegex.test(email)) {
      setEmailError("Enter a valid email");
    } else {
      setEmailError(null);
    }
    setCanSubmit(!emailError && emailRegex.test(email) && password.length > 0);
  }, [email, password, emailError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch {
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
          onChange={e => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
          required
          variant='outlined'
          sx={{
            mb: 2,
            width: "70%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontFamily: '"Montserrat", sans-serif"',
              "& fieldset": { borderColor: "#5F70C8" },
              "&:hover fieldset": { borderColor: "#5F70C8" },
              "&.Mui-focused fieldset": { borderColor: "#5F70C8" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon sx={{ color: "#5F70C8" }} />
              </InputAdornment>
            ),
          }}
        />
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
            width: "70%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              fontFamily: '"Montserrat", sans-serif"',
              "& fieldset": { borderColor: "#5F70C8" },
              "&:hover fieldset": { borderColor: "#5F70C8" },
              "&.Mui-focused fieldset": { borderColor: "#5F70C8" },
            },
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
            width: "70%",
            bgcolor: "#5F70C8",
            color: "white",
            "&:hover": { bgcolor: "#5A78B0" },
            fontFamily: '"Montserrat", sans-serif"',
          }}
        >
          LOGIN
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
