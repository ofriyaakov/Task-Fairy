import React from "react";
import '@fontsource/montserrat';
import ReactDOM from "react-dom/client";
import '@fontsource/montserrat';
import "./index.css";
import App from "./App";
import { GlobalContextProvider } from "./contexts/GlobalContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <GlobalContextProvider>
      <App />
    </GlobalContextProvider>
  </React.StrictMode>
);
