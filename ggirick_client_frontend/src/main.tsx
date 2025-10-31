import { initThemeMode } from "flowbite-react";

import { createRoot } from "react-dom/client";
import { ThemeInit } from "../.flowbite-react/init";
// @ts-ignore
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <ThemeInit />
    <App />
  </>,
);

initThemeMode();
