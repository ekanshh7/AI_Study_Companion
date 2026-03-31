import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { StudyProvider } from "./context/StudyContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StudyProvider>
      <App />
      <ToastContainer
        position="top-right"
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </StudyProvider>
  </StrictMode>,
);
