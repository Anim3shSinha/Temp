import React, { useState } from "react";
import axios from "axios";
import { CONST } from "../../../../constants.js";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const App = () => {
  const [facebookAccessToken, setFacebookAccessToken] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const redirect_path = `${CONST.server}/facebook-callback`;

  const handleFacebookResponse = async (response) => {
    console.log("Facebook response:", response);
    if (response.accessToken) {
      setFacebookAccessToken(response.accessToken);
    } else {
      console.error("Facebook response did not contain access token");
    }
  };

  const handlePageToken = async () => {
    try {
      const response1 = await axios.post(
        `${CONST.server}/api/facebook/page-access-token`,
        {
          userAccessToken: facebookAccessToken,
        }
      );
      setPageAccessToken(response1.data.pageAccessToken);
    } catch (error) {
      console.error("Error getting page access token:", error);
    }
  };

  const handlePostToPage = async () => {
    try {
      const response = await axios.post(
        `${CONST.server}/api/facebook/post-to-page`,
        {
          pageAccessToken: pageAccessToken,
          message: "This is a test post from my app!",
        }
      );

      console.log("Post successful:", response.data.postId);
    } catch (error) {
      console.error("Error posting to page:", error);
    }
  };

  return (
    <div>
      <FacebookLogin
        appId="959234698469542"
        fields="name,email"
        scope="email,pages_manage_cta,pages_show_list,page_events,pages_read_engagement,pages_manage_metadata,pages_manage_ads,pages_manage_posts,public_profile"
        callback={handleFacebookResponse}
        // redirectUri="https://2f0a-103-171-247-181.ngrok-free.app/facebook-callback"
        redirectUri={redirect_path}
        render={(renderProps) => (
          <button onClick={renderProps.onClick}>Log in with Facebook</button>
        )}
      />
      token : {facebookAccessToken || "null"}
      page token : {pageAccessToken || "null"}
      <div>
        <button onClick={handlePageToken}>get page token</button>
      </div>
      <div>
        <button onClick={handlePostToPage}>Post</button>
      </div>
    </div>
  );
};

export default App;
