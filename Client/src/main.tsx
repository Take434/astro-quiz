import { createRoot } from "react-dom/client";
import "./styles.css";
import { StrictMode } from "react";
import { App } from "./App.tsx";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
);
