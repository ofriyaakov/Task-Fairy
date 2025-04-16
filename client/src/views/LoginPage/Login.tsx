import { Button, Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../queries/auth";
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
      });

      navigate("/dashboard");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      {/* Forgot Password Link */}
      <Typography
        onClick={() => navigate("/register")}
        variant="body2"
        align="center"
        color="textSecondary"
        sx={{ mb: 4, textDecorationLine: "underline", cursor: "pointer" }}
      >
        Need an account? Register
      </Typography>

      {/* Tagline */}
      <Typography
        variant="h6"
        component="div"
        sx={{
          color: "#6B8CC8",
          mt: 3,
          fontWeight: "normal",
          fontSize: "1.2rem",
        }}
      >
        Turning To-Dos into Ta-Das!
      </Typography>
    </div>
  );
};

export default Login;
