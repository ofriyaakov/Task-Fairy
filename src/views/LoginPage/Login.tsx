import { Button } from "@mui/material";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../queries/auth";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });
      console.log("Logged in:", response);
      navigate("/home");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleLogin} />
      <Button onClick={() => navigate("/register")} sx={{ mt: 2 }}>
        Need an account? Register
      </Button>
    </div>
  );
};
