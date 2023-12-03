import React, { useState, useEffect } from "react";
import axios from "axios";

import { CONST } from "../../../../constants";
const GLogin = () => {
  const [accessToken, setAccessToken] = useState("");
  useEffect(() => {
    // Get the authorization code from the URL.
    const authorizationCode = new URLSearchParams(window.location.search).get(
      "code"
    );
    console.log(authorizationCode);
    // If there is an authorization code, exchange it for an access token.
    if (authorizationCode) {
      axios
        .get(`http://localhost:8080/google_business_access_token`, {
          params: {
            authorizationCode: authorizationCode,
          },
        })
        // .then((response) => setAccessToken(response.data.accessToken))
        .catch((error) => {
          console.error("Error getting access token: ", error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Google Business Login</h1>
      <button
        onClick={() =>
          (window.location.href =
            "https://accounts.google.com/o/oauth2/v2/auth?client_id=82909150064-nrukndkgunfrjuvpqr2868mpckrrp70p.apps.googleusercontent.com&redirect_uri=http://localhost:3000/ClientInfo&response_type=code&scope=https://www.googleapis.com/auth/business.manage&access_type=offline")
        }
      >
        Log in with Google Business
      </button>
      <p>accesstoken : {accessToken || null}</p>
    </div>
  );
};

export default GLogin;
