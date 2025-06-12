import { Button, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import { useNavigate } from "react-router-dom";
import { RegistrationData } from "./types";
import { register } from "../../queries/auth";
import "./Registration.css";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { APP_COLOR } from "../../theme";
import { toast } from "react-toastify";

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { updateConnectedUser } = useGlobalContext();

  const handleRegister = async (data: RegistrationData) => {
    try {
      const response = await register(data);
      updateConnectedUser(
        {
          id: response.id,
          name: response.name,
          email: response.email,
          companyId: response.companyId,
          userLevel: response.userLevel,
          groupId: response.groupId,
          groupName: response.groupName,
          firstLogin: response.firstLogin,
        },
        response.accessToken,
        response.refreshToken
      );
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Registration failed");
      console.error(err.message);
    }
  };

  return (
    <div className='register-container'>
      <RegistrationForm onSubmit={handleRegister} />

      <Typography
        variant='body2'
        color='text.secondary'
        sx={{ fontFamily: '"Montserrat", sans-serif' }}>
        Already have a user?
        <Button
          sx={{ fontFamily: '"Montserrat", sans-serif', py: 0 }}
          onClick={() => navigate("/login")}>
          Login
        </Button>
      </Typography>
      <Typography
        variant='h5'
        component='h2'
        align='center'
        color='primary.main'
        fontWeight='bold'
        fontSize={"2rem"}
        sx={{
          mt: 1,
          fontFamily: '"Montserrat", sans-serif',
          color: APP_COLOR.ROYAL_BLUE,
        }}>
        Turning To-Dos into Ta-Das!
      </Typography>
    </div>
  );
};
