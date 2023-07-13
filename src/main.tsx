import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {SnackbarProvider} from "notistack";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <SnackbarProvider
          preventDuplicate
          autoHideDuration={1500}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
          }}
      >
          <App />
      </SnackbarProvider>
  </React.StrictMode>
);
