import { Button } from "@mui/material";
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
      <Button onClick={() => navigate("/login")} sx={{ mt: 2 }}>
        already have an account? Login
      </Button>
    </div>
  );
};
