import { createRoot } from "react-dom/client";

import "./styles.css";

import { StrictMode } from "react";

import { App } from "./App.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
);
