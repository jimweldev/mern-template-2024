import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// libraries
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBell,
  faHome,
  faMessage,
  fas,
  faGear,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMessage as faMessageR,
  faBell as faBellR,
  faUser as faUserR,
} from "@fortawesome/free-regular-svg-icons";

library.add(
  fas,
  faHome,
  faMessage,
  faMessageR,
  faBellR,
  faBell,
  faGear,
  faUserR,
  faArrowRightFromBracket
);

// CSS & JS
import "bootstrap/dist/css/bootstrap.min.css";
import "@adminkit/core/dist/css/app.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import "@assets/index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
