import "typeface-nunito-sans";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./Router";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
