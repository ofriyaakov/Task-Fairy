import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { State, City } from "country-state-city";
import { useGlobalContext } from "../../contexts/GlobalContext";

const districts = State.getStatesOfCountry("IL");
const israelCities = districts.flatMap((district) => {
  return City.getCitiesOfState("IL", district.isoCode);
});
const cityList = israelCities.map((city) => city.name);

interface FirstLoginPopupProps {
  open: boolean;
  onSubmit: (user_id: string, password: string, city: string) => void;
}

const FirstLoginPopup: React.FC<FirstLoginPopupProps> = ({
  open,
  onSubmit,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [city, setCity] = useState("");
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);
  const { connectedUser } = useGlobalContext();

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isPasswordValid && passwordsMatch && city;

  const handleSubmit = () => {
    if (isFormValid && connectedUser) {
      onSubmit( connectedUser.id, password, city );
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      fullWidth
      maxWidth="xs"
      onClose={(e, reason) => {
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          return;
        }
      }}
    >
      <DialogTitle>Welcome! Set Up Your Account</DialogTitle>
      <DialogContent>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value) 
            setTouchedPassword(true)
          }}
          error={touchedPassword && !isPasswordValid}
          helperText={
            touchedPassword && !isPasswordValid
              ? "Password must be at least 6 characters"
              : " "
          }
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setTouchedConfirm(true);
          }}
          error={touchedConfirm && !passwordsMatch}
          helperText={
            touchedConfirm && !passwordsMatch ? "Passwords do not match" : " "
          }
        />

        <TextField
          label="Choose Your City"
          select
          fullWidth
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            },
          }}
        >
          {cityList.map((cityOption) => (
            <MenuItem key={cityOption} value={cityOption}>
              {cityOption}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
        >
          Save & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FirstLoginPopup;
