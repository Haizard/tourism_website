import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Analytics from "./components/Analytics";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Analytics />
    <App />
  </React.StrictMode>,
);
