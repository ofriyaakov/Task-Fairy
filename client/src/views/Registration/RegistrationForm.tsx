import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, SvgIcon } from "@mui/material";
import { RegistrationData } from "./types";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    first_name: "",
    last_name: "",
    repeat_password: "",
    phone_number: "",
    company_name: "",
    user_level: "",
    password: "",
    email: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      {/* Logo and Title */}
      <img src="/Logo.png" alt="Logo" width={370} height={270} />

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {/* User Name */}
          <TextField
            name="first name"
            placeholder="FIRST NAME *"
            value={formData.first_name}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
              width: "100%",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: "#5F70C8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="last name"
            placeholder="LAST NAME *"
            value={formData.last_name}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon sx={{ color: "#5F70C8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* user id */}
          <TextField
            fullWidth
            name="user_id"
            placeholder="ID *"
            value={formData.user_id}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon sx={{ color: "#5F70C8" }} />
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
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlinedIcon sx={{ color: "#5F70C8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Company Name */}
          <TextField
            fullWidth
            name="companyName"
            placeholder="COMPANY NAME *"
            value={formData.company_name}
            onChange={handleChange}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WorkOutlineOutlinedIcon sx={{ color: "#5F70C8" }} />
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
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#5F70C8" }} />
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
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#5F70C8" }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Repeat password */}
          <TextField
            fullWidth
            name="repeat password"
            placeholder="REPEAT PASSWORD *"
            type="password"
            value={formData.repeat_password}
            onChange={handleChange}
            required
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                fontFamily: '"Montserrat", sans-serif',
                color: "#102cc2",
              },
              "& fieldset": {
                borderColor: "#5F70C8", // default border color
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#5F70C8" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Register Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            mt: 3,
            py: 1,
            borderRadius: 1,
            textTransform: "uppercase",
            bgcolor: "#5F70C8",
            "&:hover": { bgcolor: "primary.dark" },
            fontFamily: '"Montserrat", sans-serif',
            width: "60%"
          }}
        >
          {loading ? "REGISTERING..." : "REGISTER"}
        </Button>

        {/* Login Link */}
      </Box>
      {/* Tagline */}
    </Box>
  );
};

export default RegistrationForm;
