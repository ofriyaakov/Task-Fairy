import { createTheme } from '@mui/material/styles';

export const APP_COLOR = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",

  ALICE_BLUE: "#E3F2FD",
  OFF_WHITE: "#FAFAFA",
  PLATINUM_GREY: "#E6E6E6",
  DARK_GREY: "#666666",

  MINT_GREEN: "#D4F8E8",
  LIGHT_RED: "#F8D4D4",

  ROYAL_BLUE : "#5F70C8",
};

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
  },  
});

export default theme;
