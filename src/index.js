import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.scss";
// eslint-disable-next-line no-unused-vars
import pdfjs from "pdfjs-dist";
// eslint-disable-next-line no-unused-vars
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevTools();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
