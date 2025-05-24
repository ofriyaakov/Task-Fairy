import { Typography } from "@mui/material";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { login } from "../../queries/auth";
import "./Login.css";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { APP_COLOR } from "../../theme";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const { setConnectedUser } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login({ email, password });

      setConnectedUser({
        id: response.id,
        name: response.name,
        email: response.email,
        companyId: response.companyId,
        userLevel: response.userLevel,
        groupId: response.groupId,
        groupName: response.groupName,
        firstLogin: response.firstLogin,
      });

      navigate(response.userLevel == 2 ? "/dashboard" : "/profile");
    } catch (err: any) {
      toast.error("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className='login-container'>
      <LoginForm onSubmit={handleLogin} />

      <Typography
        onClick={() => navigate("/register")}
        variant='body2'
        align='center'
        color='textSecondary'
        sx={{
          mb: 4,
          textDecorationLine: "underline",
          cursor: "pointer",
          fontFamily: '"Montserrat", sans-serif',
        }}>
        Need an account? Register
      </Typography>

      <Typography
        variant='h6'
        component='div'
        sx={{
          color: APP_COLOR.ROYAL_BLUE,
          mt: 1,
          fontWeight: "bolder",
          fontSize: "2.3rem",
          fontFamily: '"Montserrat", sans-serif',
        }}>
        Turning To‑Dos into Ta‑Das!
      </Typography>
    </div>
  );
};

export default Login;
