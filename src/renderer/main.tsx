import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { App } from "./App";
import "./styles.css";
import { installBrowserBridge, shouldInstallBrowserBridge } from "./support/browserBridge";

if (shouldInstallBrowserBridge({ mode: import.meta.env.MODE, search: window.location.search }) && !window.winTogether) {
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
