import React, { useState } from "react";
import axios from "axios";
import { CONST } from "../../../../constants.js";

const LinkedInLogin = () => {
  const [accessToken, setAccessToken] = useState("null");

  const handleLinkedInLogin = async () => {
    try {
      const response = await axios.get(`${CONST.server}/api/linkedin/login`);
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error("LinkedIn login error:", error);
    }
  };

  const handleShowAccessToken = async () => {
    try {
      const response = await axios.get(
        `${CONST.server}/api/linkedin/callback`,
        {
          params: {
            code: new URLSearchParams(window.location.search).get("code"),
          },
        }
      );

      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const [postText, setPostText] = useState("");
  const [userLinkedInId, setUserLinkedInId] = useState("");
  const [userName, setUserName] = useState("");
  const fetchLinkedInId = async () => {
    try {
      const response = await axios.post(
        `${CONST.server}/api/linkedin/get-profile`,
        {
          accessToken: accessToken,
        }
      );
      setUserLinkedInId(response.data.linkedInId);
    } catch (error) {
      console.error("Error fetching LinkedIn ID:", error.response.data);
    }
  };

  const fetchLinkedInName = async () => {
    try {
      const response = await axios.post(
        `${CONST.server}/api/linkedin/get-name`,
        {
          accessToken: accessToken,
        }
      );
      setUserName(response.data.fullName);
    } catch (error) {
      console.error("Error fetching LinkedIn name:", error.response.data);
    }
  };

  const handlePost = async () => {
    try {
      if (!userLinkedInId) {
        await fetchLinkedInId();
      }

      const postResponse = await axios.post(
        `${CONST.server}/api/linkedin/post`,
        {
          postText,
          accessToken: accessToken,
          linkedInId: userLinkedInId,
        }
      );

      console.log("Post created:", postResponse.data);
    } catch (error) {
      console.error("Error creating post:", error.response.data);
    }
  };

  const handleButtonClick = () => {
    fetchLinkedInId();
    fetchLinkedInName();
  };

  return (
    <>
      <button onClick={handleLinkedInLogin}>Login with LinkedIn</button>
      <button onClick={handleShowAccessToken}> show acccess token </button>
      <button onClick={handleButtonClick}> fetch ID </button>
      <div>Access Token: {accessToken}</div>
      <div>User Id : {userLinkedInId}</div>
      <div>User name : {userName}</div>

      <div>
        <textarea
          placeholder="Enter your post text..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
        <button onClick={handlePost}>Create Post</button>
      </div>
    </>
  );
};

export default LinkedInLogin;
