import { Button, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import { useNavigate } from "react-router-dom";
import { RegistrationData } from "./types";
import { register } from "../../queries/auth";

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
    <div>
      <RegistrationForm onSubmit={handleRegister} />

      <Typography variant='body2' color='text.secondary'>
        Already have a user?
        <Button onClick={() => navigate("/login")}>Login</Button>
      </Typography>
      <Typography
        variant='h5'
        component='h2'
        align='center'
        color='primary.main'
        fontWeight='medium'
        sx={{ mt: 4 }}>
        Turning To-Dos into Ta-Das!
      </Typography>
    </div>
  );
};
