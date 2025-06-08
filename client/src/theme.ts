import { createTheme } from '@mui/material/styles';

export const APP_COLOR = {
  BLACK: "#000000",
  WHITE: "#FFFFFF",

  ALICE_BLUE: "#E3F2FD",
  ALICE_BLUE_DARKER: "#DDEEFB",
  OFF_WHITE: "#FAFAFA",
  PLATINUM_GREY: "#E6E6E6",
  DARK_GREY: "#666666",

  MINT_GREEN: "#E1F7EF",
  LIGHT_RED: "#FFDFDF",

  ROYAL_BLUE: "#5F70C8",
  CERULEAN_BLUE: "#457B9D"
};

export const INDICATION_COLOR = {
  BEST: '#A8E6CF',     // pastel green
  GOOD: '#FFFBAB',      // pastel yellow
  MID: '#FFD3B6',      // pastel orange
  BAD: '#FF8B94'      // pastel red
}

const theme = createTheme({
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
  },  
});

export default theme;
