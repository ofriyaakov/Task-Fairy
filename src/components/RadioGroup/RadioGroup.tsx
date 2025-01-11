import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";

export interface Option {
  value: string;
  label: string;
}

interface CustomRadioGroupProps {
  label: string;
  name: string;
  options: Option[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  row?: boolean;
}

const RadioGroupButtons: React.FC<CustomRadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  required = false,
  row = false,
}) => {
  return (
    <FormControl error={!!error} required={required} margin='normal' fullWidth>
      <FormLabel>{label}</FormLabel>
      <RadioGroup name={name} value={value} onChange={onChange} row={row}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default RadioGroupButtons;
