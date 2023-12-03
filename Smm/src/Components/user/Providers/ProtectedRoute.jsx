import React, { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(props) {
  const [shouldLoad, setshouldLoad] = useState(false);
  const navigate = useNavigate();

  const { Component } = props;

  useEffect(() => {
    let name = localStorage.getItem("uname");
    let role = localStorage.getItem("role");
    let uid = localStorage.getItem("uid");
    let AdminId = localStorage.getItem("AdminId");

    // Redirect if any of the values are null.
    if (!name || !role || !uid || AdminId) {
      navigate("/Login"); // assuming /login is your login route
    } else {
      setshouldLoad(true);
    }
  }, []);

  return <React.Fragment>{shouldLoad ? <Component /> : null}</React.Fragment>;
}

export default ProtectedRoute;
