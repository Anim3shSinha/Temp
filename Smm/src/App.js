import React from "react";

import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "./Components/user/pages/dashboard/dashboard";
import MediaEditor from "./Components/user/pages/MediaEditor/MediaEditor";
import Contents from "./Components/user/pages/Contents/Contents";
import Profile from "./Components/user/pages/Profile/Profile";
import GPT from "./Components/user/pages/GPT/GPT";
import Accounts from "./Components/user/pages/Accounts/Accounts";
import Login from "./Components/user/pages/Login/login";
import Requirements from "../src/Components/user/pages/Requirements/Requirement";
import SignUp from "./Components/user/pages/Signup/signup";
import ProtectedRoute from "./Components/user/Providers/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Calender from "./Components/user/pages/dashboard/Calender";
import ClientInfo from "./Components/user/pages/ClientInformation/ClientInfo";
import Navbar from "./Components/user/layouts/Navbar/Navbar";
import Homepage from "./Components/user/layouts/HomePage/Home";

function App() {
  return (
    <React.Fragment>
      <GoogleOAuthProvider clientId="753124195649-0v404kl4hekpr1isc16u05c2ai4n02ps.apps.googleusercontent.com">
        <BrowserRouter>
          <Routes>
            <Route
              path="/cal"
              element={<ProtectedRoute Component={Calender} />}
              // element={<Calender />}
            />
            <Route
              path="/dash"
              element={<ProtectedRoute Component={Dashboard} />}
            />
            <Route path="/" element={<ProtectedRoute Component={Homepage} />} />
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route
              path="/MediaEditor"
              element={<ProtectedRoute Component={MediaEditor} />}
              // element={<MediaEditor />}
            />
            <Route
              path="/Contents"
              element={<ProtectedRoute Component={Contents} />}
              // element={<Contents />}
            />
            <Route
              path="/ClientInfo"
              element={<ProtectedRoute Component={ClientInfo} />}
              // element={<ClientInfo />}
            />
            <Route
              path="/Profile"
              element={<ProtectedRoute Component={Profile} />}
            />
            <Route path="/GPT" element={<ProtectedRoute Component={GPT} />} />
            <Route
              path="/Accounts"
              element={<ProtectedRoute Component={Accounts} />}
              // element={<Accounts />}
            />
            <Route
              path="/Requirements"
              element={<ProtectedRoute Component={Requirements} />}
              // element={<Requirements />}
            />
            <Route path="/Login" exact element={<Login />} />
            <Route path="/Signup" exact element={<SignUp />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </React.Fragment>
  );
}

export default App;
