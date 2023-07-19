import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {SnackbarProvider} from "notistack";
import {ErrorBoundary} from "react-error-boundary";
import Fallback from "./errors/error_boundary"


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <ErrorBoundary
          FallbackComponent={Fallback}
      >
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
      </ErrorBoundary>;
  </React.StrictMode>
);
