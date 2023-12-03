import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONST } from "../../../../constants.js";

const TwitterLogin = () => {
  // const [accessToken, setAccessToken] = useState(null);
  const [authUrl, setAuthUrl] = useState("");

  // const [accessTokenSecret, setAccessTokenSecret] = useState(null);

  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userAccessTokenSecret, setUserAccessTokenSecret] = useState(null);

  const [tweetResult, setTweetResult] = useState(null);

  const handlePostTweet = async () => {
    try {
      const response = await axios.post(`${CONST.server}/post-tweet`, {
        accessToken: userAccessToken,
        accessTokenSecret: userAccessTokenSecret,
        status: "hi there",
      });

      setTweetResult(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    // Parse the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("userAccessToken");
    const accessTokenSecret = queryParams.get("userAccessTokenSecret");

    setUserAccessToken(accessToken);
    setUserAccessTokenSecret(accessTokenSecret);
  }, []);

  const handleLogin = async () => {
    try {
      // const response = await axios(`${CONST.server}/twitter_login`, {
      //   // method: "GET",
      //   // mode: "no-cors",
      // });
      const response = await axios.get(`${CONST.server}/twitter-login`);
      // console.log(response);
      setAuthUrl(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const redirectToTwitterAuth = () => {
    window.location.href = authUrl;
  };

  return (
    <div>
      <h1>Twitter Login</h1>
      <button onClick={handleLogin}>Log in with Twitter</button>
      <br /> url : {authUrl || "null"}
      <button onClick={redirectToTwitterAuth}>redirct</button>
      <br />
      <p>Access Token: {userAccessToken || "null"}</p>
      <br />
      <p>Access Token Secret: {userAccessTokenSecret || "null"}</p>
      <br /> <button onClick={handlePostTweet}>post</button>
      <p>tweet: {tweetResult || "null"}</p>
    </div>
  );
};

export default TwitterLogin;
