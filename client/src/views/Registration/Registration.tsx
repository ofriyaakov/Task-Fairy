import { Button, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import { useNavigate } from "react-router-dom";
import { RegistrationData } from "./types";
import { register } from "../../queries/auth";
import "./Registration.css";

export const Registration: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: RegistrationData) => {
    // Add registration logic here
    try {
      const response = await register(data);
      console.log("Registered:", response);
      navigate("/home");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="register-container">
      <RegistrationForm onSubmit={handleRegister} />

      <Typography variant='body2' color='text.secondary' sx={{ fontFamily: '"Montserrat", sans-serif' }}>
        Already have a user?
        <Button sx={{ fontFamily: '"Montserrat", sans-serif', py: 0 }} onClick={() => navigate("/login")}>Login</Button>
      </Typography>
      <Typography
        variant='h5'
        component='h2'
        align='center'
        color='primary.main'
        fontWeight='bold'
        fontSize={"2rem"}
        sx={{ mt: 1, fontFamily: '"Montserrat", sans-serif', color: "#5F70C8" }}>
        Turning To-Dos into Ta-Das!
      </Typography>
    </div>
  );
};
