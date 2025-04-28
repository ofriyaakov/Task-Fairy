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
import { emailRegex } from "../../consts";
import { APP_COLOR } from "../../theme";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

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
              "& fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
              "&:hover fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
              "&.Mui-focused fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonOutlineIcon sx={{ color: APP_COLOR.ROYAL_BLUE }} />
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
              "& fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
              "&:hover fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
              "&.Mui-focused fieldset": { borderColor: APP_COLOR.ROYAL_BLUE },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <LockOutlinedIcon sx={{ color: APP_COLOR.ROYAL_BLUE }} />
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
            bgcolor: APP_COLOR.ROYAL_BLUE,
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
