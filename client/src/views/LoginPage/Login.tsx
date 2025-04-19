import { Button, Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../queries/auth";
import './Login.css';
import { useGlobalContext } from "../../contexts/GlobalContext";

const Login: React.FC = () => {
  const { setConnectedUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      console.log("Logged in:", response);
      setConnectedUser({
        id: response.id,
        name: response.name,
        email: response.email,
        companyId: response.companyId,
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="login-container">
      <LoginForm onSubmit={handleLogin} />
      {/* Forgot Password Link */}
      <Typography
        onClick={() => navigate("/register")}
        variant='body2'
        align='center'
        color='textSecondary'
        sx={{ mb: 4, textDecorationLine: "underline", cursor: "pointer", fontFamily: '"Montserrat", sans-serif' }}>
        Need an account? Register
      </Typography>

      {/* Tagline */}
      <Typography
        variant='h6'
        component='div'
        sx={{
          color: "#5F70C8",
          mt: 1,
          fontWeight: "bolder",
          fontSize: "2.3rem",
          fontFamily: '"Montserrat", sans-serif'
        }}>
        Turning To-Dos into Ta-Das!
      </Typography>
    </div>
  );
};

export default Login;
