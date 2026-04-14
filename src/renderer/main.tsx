import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { installBrowserBridge } from "../../tests/e2e/fixtures/browserBridge";
import { App } from "./App";
import "./styles.css";

if (!navigator.userAgent.includes("Electron") && !window.winTogether) {
  installBrowserBridge(window);
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);
