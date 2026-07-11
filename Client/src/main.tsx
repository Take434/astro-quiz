import { createRoot } from "react-dom/client";
import "./styles.css";
import { StrictMode } from "react";
import { App } from "./app.tsx";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
);
