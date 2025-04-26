import { Button, Typography } from "@mui/material";
import RegistrationForm from "./RegistrationForm";
import { useNavigate } from "react-router-dom";
import { RegistrationData } from "./types";
import { register } from "../../queries/auth";
import "./Registration.css";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { mainColor } from "../../consts";

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { setConnectedUser } = useGlobalContext();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const handleRegister = async (data: RegistrationData) => {
    try {
      const response = await register(data);
      setConnectedUser({
        id: response.id,
        name: response.name,
        email: response.email,
        companyId: response.companyId,
        userLevel: response.userLevel,
        groupId: response.groupId,
        groupName: response.groupName
      });
      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err.message || "Registration failed";
      setSnackMessage(message);
      setSnackOpen(true);
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
        sx={{ mt: 1, fontFamily: '"Montserrat", sans-serif', color: mainColor }}>
        Turning To-Dos into Ta-Das!
      </Typography>

      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="error"
          variant="filled"
          sx={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
