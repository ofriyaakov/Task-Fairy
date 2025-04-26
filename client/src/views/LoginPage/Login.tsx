import { Button, Typography, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../queries/auth";
import './Login.css';
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState } from "react";
import { mainColor } from "../../consts";

const Login: React.FC = () => {
  const { setConnectedUser } = useGlobalContext();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [snackOpen, setSnackOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      setConnectedUser({
        id: response.id,
        name: response.name,
        email: response.email,
        companyId: response.companyId,
      });
      navigate("/dashboard");
    } catch (err: any) {
      // Show snackbar with the server error message
      setErrorMsg(err?.message || "Invalid email or password");
      setSnackOpen(true);
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <LoginForm onSubmit={handleLogin} />

      <Typography
        onClick={() => navigate("/register")}
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{
          mb: 4,
          textDecorationLine: "underline",
          cursor: "pointer",
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        Need an account? Register
      </Typography>

      <Typography
        variant="h6"
        component="div"
        sx={{
          color: mainColor,
          mt: 1,
          fontWeight: "bolder",
          fontSize: "2.3rem",
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        Turning To‑Dos into Ta‑Das!
      </Typography>

      {/* Snackbar for errors */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="error"
          elevation={6}
          variant="filled"
        >
          {errorMsg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
