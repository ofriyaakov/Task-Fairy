import React from 'react';
import {
  ToggleButtonGroup,
  ToggleButton as MuiToggleButton,
  FormControl,
  FormLabel,
  FormHelperText
} from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface CustomToggleButtonProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const ToggleButton: React.FC<CustomToggleButtonProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  required = false
}) => {
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <FormControl error={!!error} required={required} fullWidth margin="normal">
      <FormLabel>{label}</FormLabel>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
        fullWidth
        sx={{ mt: 1 }}
      >
        {options.map((option) => (
          <MuiToggleButton 
            key={option.value} 
            value={option.value}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }
            }}
          >
            {option.label}
          </MuiToggleButton>
        ))}
      </ToggleButtonGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default ToggleButton;