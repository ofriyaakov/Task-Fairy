import "typeface-nunito-sans";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Router from "./Router";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <ToastContainer position='bottom-right' autoClose={3000} />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
