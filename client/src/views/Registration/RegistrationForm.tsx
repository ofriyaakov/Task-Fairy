import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { RegistrationData } from "./types";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { mainColor } from "../../consts";

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const managerLevel = "2";
  const [formData, setFormData] = useState<RegistrationData>({
    first_name: "",
    last_name: "",
    repeat_password: "",
    phone_number: "",
    company_name: "",
    user_level: managerLevel,
    password: "",
    email: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(false);

  // ── VALIDATION RULES ────────────────────────────────────────────────────────
  const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
  const isPasswordValid = formData.password.length >= 6;
  const isUserIdValid = /^\d{9}$/.test(formData.user_id);
  const isPhoneNumberValid = /^\d{10}$/.test(formData.phone_number);
  const doPasswordsMatch = formData.password === formData.repeat_password;
  const areRequiredFilled =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.user_id.trim() &&
    formData.phone_number.trim() &&
    formData.company_name.trim() &&
    formData.email.trim();
  const isFormValid =
    Boolean(areRequiredFilled) &&
    isEmailValid &&
    isPasswordValid &&
    doPasswordsMatch;
  // ────────────────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 550, mx: "auto", pb: 2, px: 2 }}>
      {/* Logo */}
      <Box
        component="img"
        src="/Logo.png"
        alt="Logo"
        sx={{
          width: {
            xs: "100%",
            sm: "80%",
            md: "60%",
            lg: "400px",
            xl: "400px",
          },
          height: "auto",
          mx: "auto",
        }}
      />

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* First Name */}
          <TextField
            name="first_name"
            placeholder="FIRST NAME *"
            value={formData.first_name}
            onChange={handleChange}
            required
            error={formData.first_name !== "" && !formData.first_name.trim()}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
              width: "100%",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Last Name */}
          <TextField
            fullWidth
            name="last_name"
            placeholder="LAST NAME *"
            value={formData.last_name}
            onChange={handleChange}
            required
            error={formData.last_name !== "" && !formData.last_name.trim()}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* User ID */}
          <TextField
            fullWidth
            name="user_id"
            placeholder="ID *"
            value={formData.user_id}
            onChange={handleChange}
            required
            error={formData.user_id !== "" && !isUserIdValid}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            name="phone_number"
            placeholder="PHONE NUMBER *"
            value={formData.phone_number}
            onChange={handleChange}
            required
            error={formData.phone_number !== "" && !isPhoneNumberValid}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Company Name */}
          <TextField
            fullWidth
            name="company_name"
            placeholder="COMPANY NAME *"
            value={formData.company_name}
            onChange={handleChange}
            required
            error={formData.company_name !== "" && !formData.company_name.trim()}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkOutlineOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            name="email"
            placeholder="EMAIL *"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            error={formData.email !== "" && !isEmailValid}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            name="password"
            placeholder="PASSWORD *"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            error={formData.password !== "" && !isPasswordValid}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Repeat Password */}
          <TextField
            fullWidth
            name="repeat_password"
            placeholder="REPEAT PASSWORD *"
            type="password"
            value={formData.repeat_password}
            onChange={handleChange}
            required
            error={
              formData.repeat_password !== "" && !doPasswordsMatch
            }
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": { borderColor: mainColor },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: mainColor }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Register Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !isFormValid}
          sx={{
            mt: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "uppercase",
            bgcolor: mainColor,
            "&:hover": { bgcolor: "primary.dark" },
            fontFamily: '"Montserrat", sans-serif',
            width: "60%",
          }}
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;