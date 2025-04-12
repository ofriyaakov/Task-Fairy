import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment, SvgIcon } from "@mui/material";
import { RegistrationData } from "./types";

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => Promise<void>;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    username: "",
    // phoneNumber: "",
    // companyName: "",
    user_level: "",
    password: "",
    email: "",
    user_id: ""
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
    <Box sx={{ maxWidth: 400, mx: "auto", pt: 4, pb: 2, px: 2 }}>
      {/* Logo and Title */}
      <img src='/Logo.png' alt='Logo' />

      {/* Form */}
      <Box component='form' onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}>
          {/* User Name */}
          <TextField
            fullWidth
            name='username'
            placeholder='USER NAME'
            value={formData.username}
            onChange={handleChange}
            required
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <circle
                      cx='12'
                      cy='8'
                      r='4'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path
                      d='M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20'
                      stroke='currentColor'
                      fill='none'
                    />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />

          {/* user id */}
          <TextField
            fullWidth
            name='user_id'
            placeholder='ID'
            value={formData.user_id}
            onChange={handleChange}
            required
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <path
                      d='M6 4H10C11.1046 4 12 4.89543 12 6V18C12 19.1046 11.1046 20 10 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4Z'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path
                      d='M12 8H16C17.1046 8 18 8.89543 18 10V14C18 15.1046 17.1046 16 16 16H12'
                      stroke='currentColor'
                      fill='none'
                    />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />

          {/* Company Name */}
          <TextField
            fullWidth
            name='companyName'
            placeholder='COMPANY NAME'
            // value={formData.companyName}
            // onChange={handleChange}
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <rect
                      x='4'
                      y='6'
                      width='16'
                      height='12'
                      rx='1'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path d='M8 12H16' stroke='currentColor' />
                    <path d='M8 16H16' stroke='currentColor' />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />

          {/* Company Role */}
          <TextField
            fullWidth
            name='user_level'
            placeholder='COMPANY ROLE'
            value={formData.user_level}
            onChange={handleChange}
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <rect
                      x='6'
                      y='4'
                      width='12'
                      height='16'
                      rx='1'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path d='M10 10H14' stroke='currentColor' />
                    <path d='M10 14H14' stroke='currentColor' />
                    <path d='M11 6H13' stroke='currentColor' />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <TextField
            fullWidth
            name='password'
            placeholder='PASSWORD'
            type='password'
            value={formData.password}
            onChange={handleChange}
            required
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <rect
                      x='4'
                      y='9'
                      width='16'
                      height='11'
                      rx='1'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path
                      d='M7 9V7C7 5.34315 8.34315 4 10 4H14C15.6569 4 17 5.34315 17 7V9'
                      stroke='currentColor'
                    />
                    <circle cx='12' cy='15' r='1.5' fill='currentColor' />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            fullWidth
            name='email'
            placeholder='EMAIL'
            type='email'
            value={formData.email}
            onChange={handleChange}
            required
            variant='outlined'
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SvgIcon fontSize='small'>
                    <rect
                      x='4'
                      y='6'
                      width='16'
                      height='12'
                      rx='1'
                      stroke='currentColor'
                      fill='none'
                    />
                    <path d='M4 9L12 15L20 9' stroke='currentColor' />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Register Button */}
        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={loading}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 1,
            textTransform: "uppercase",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}>
          {loading ? "REGISTERING..." : "REGISTER"}
        </Button>

        {/* Login Link */}
      </Box>
      {/* Tagline */}
    </Box>
  );
};

export default RegistrationForm;
