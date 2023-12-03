import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import initFacebookSDK from "./Components/user/pages/SocialMedia/initFacebookSDK";
import { ValueProvider } from "./contexts/ValueContext";
import App_test from "./App_test";

const root = ReactDOM.createRoot(document.getElementById("root"));
initFacebookSDK().then(() => {
  root.render(
    <React.StrictMode>
      <ValueProvider>
        {/* <App /> */}
        <App_test />
      </ValueProvider>
    </React.StrictMode>
  );
});

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App_test />
//   </React.StrictMode>
// );

