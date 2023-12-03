import { Button, Card, CardContent, Icon, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoginIcon from "@mui/icons-material/Login";
import InstagramIcon from "../../../../assets/Instagram.svg";
import InstagramWord from "../../../../assets/Instagram-word.svg";
import FacebookIcon from "../../../../assets/Facebook-logo.svg";
import FacebookWord from "../../../../assets/Facebook-word.svg";
import LinkedIn from "../../../../assets/linkedin-logo.svg";
import DriveIcon from "../../../../assets/Google Drive New.png";
import TwitterIcon from "../../../../assets/Twitter-Logo.svg";
import TwitterWord from "../../../../assets/tw.png";
import LinkedInWord from "../../../../assets/Linkedin-Logo.png";
import { CONST } from "../../../../constants.js";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useValue } from "../../../../contexts/ValueContext";

const SocialCardInsta = () => {
  const [facebookUserAccessToken, setFacebookUserAccessToken] = useState("");
  const { userId, userType } = useValue();
  useEffect(() => {
    window.FB.getLoginStatus((response) => {
      setFacebookUserAccessToken(response.authResponse?.accessToken);
      // console.log("Access", facebookUserAccessToken);
    });
  }, []);

  const logInToFB = () => {
    return new Promise((resolve) => {
      window.FB.login(
        (response) => {
          setFacebookUserAccessToken(response.authResponse?.accessToken);
          resolve(response); // Resolve the Promise when login is complete
        },
        {
          scope: "instagram_basic,pages_show_list",
        }
      );
    });
  };

  const getFacebookPages = () => {
    return new Promise((resolve) => {
      window.FB.api(
        "me/accounts",
        { access_token: facebookUserAccessToken },
        (response) => {
          resolve(response.data);
        }
      );
    });
  };

  const getInstagramAccountId = (facebookPageId) => {
    return new Promise((resolve) => {
      window.FB.api(
        facebookPageId,
        {
          access_token: facebookUserAccessToken,
          fields: "instagram_business_account",
        },
        (response) => {
          resolve(response.instagram_business_account.id);
        }
      );
    });
  };

  const saveInstagramTokens = async (userId, pageId, accessToken) => {
    try {
      await axios.post(`${CONST.server}/api/instagram/save-tokens`, {
        userId,
        pageId,
        accessToken,
      });
    } catch (error) {
      console.error("Error saving Instagram tokens:", error);
    }
  };

  const handleinstabtn = async () => {
    // Initiate the Facebook login
    const loginResponse = await logInToFB();

    if (loginResponse.authResponse && loginResponse.authResponse.accessToken) {
      try {
        const facebookPages = await getFacebookPages();

        if (facebookPages.length > 0) {
          const instagramAccountId = await getInstagramAccountId(
            facebookPages[0].id
          );
          await saveInstagramTokens(
            userId,
            instagramAccountId,
            facebookUserAccessToken
          );

          console.log("Instagram tokens saved successfully.");
        } else {
          console.log("No Facebook Pages found.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      console.log("Facebook access token not set.");
    }
  };

  return (
    <Card style={{ width: "800px", padding: "0 0 0 10px" }} variant="outlined">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img src={InstagramIcon} />
          <img src={InstagramWord} />
        </div>
        <div style={{ display: "flex", gap: "10px", margin: "24px" }}>
          <Button style={{ backgroundColor: "#231e1f", color: "white" }}>
            <OpenInNewIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={() => {
                window.open("https://www.instagram.com", "_blank");
              }}
            >
              Open
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#231e1f", color: "white" }}>
            <RefreshIcon />
            <Typography fontWeight={300} fontSize="12px">
              Refresh
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#231e1f", color: "white" }}>
            <LoginIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={handleinstabtn}
            >
              Give Access
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const SocialCardFacebook = () => {
  const [facebookAccessToken, setFacebookAccessToken] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const redirect_path = `${CONST.server}/facebook-callback`;
  const { userType, userId } = useValue();

  const handleFacebookResponse = async (response) => {
    const setFacebookAccess = async (accessToken) => {
      setFacebookAccessToken(accessToken);
    };
    console.log("Facebook response:", response.accessToken);

    if (response.accessToken) {
      await setFacebookAccess(response.accessToken);
      try {
        const response1 = await axios.post(
          `${CONST.server}/api/facebook/page-access-token`,
          {
            userAccessToken: facebookAccessToken,
            userId: userId,
          }
        );
        setPageAccessToken(response1.data.pageAccessToken);
      } catch (error) {
        console.error("Error getting page access token:", error);
      }
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
          userId: userId,
        }
      );
      setPageAccessToken(response1.data.pageAccessToken);
    } catch (error) {
      console.error("Error getting page access token:", error);
    }
  };

  return (
    <Card
      style={{
        width: "800px",
        padding: "0 0 0 10px",
        backgroundColor: "#39569C",
      }}
      variant="outlined"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img src={FacebookIcon} />
          <img src={FacebookWord} />
        </div>
        <div style={{ display: "flex", gap: "10px", margin: "24px" }}>
          <Button style={{ backgroundColor: "#fff", color: "#202020" }}>
            <OpenInNewIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={() => {
                window.open("https://www.facebook.com/login", "_blank");
              }}
            >
              Open
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#fff", color: "#202020" }}>
            <RefreshIcon />
            <Typography fontWeight={300} fontSize="12px">
              Refresh
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#fff", color: "#202020" }}>
            <LoginIcon />
            <Typography fontWeight={300} fontSize="12px">
              <FacebookLogin
                appId="959234698469542"
                fields="name,email"
                scope="email,pages_manage_cta,pages_show_list,page_events,pages_read_engagement,pages_manage_metadata,pages_manage_ads,pages_manage_posts,public_profile,publish_video"
                callback={handleFacebookResponse}
                redirectUri={redirect_path}
                render={(renderProps) => (
                  <button onClick={renderProps.onClick}>Give Access</button>
                )}
              />
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const SocialCardLinkedIn = () => {
  const [accessToken, setAccessToken] = useState("null");
  const [userLinkedInId, setUserLinkedInId] = useState("");
  const { userType, userId } = useValue();

  const handleLinkedInLogin = async () => {
    try {
      const response = await axios.get(`${CONST.server}/api/linkedin/login`);
      // const response = await axios.get(
      //   `http://localhost:5000/api/linkedin/login`
      // );
      window.location.href = response.data.redirectUrl;
    } catch (error) {
      console.error("LinkedIn login error:", error);
    }
  };

  const handleShowAccessToken = async () => {
    try {
      const response = await axios.get(
        `${CONST.server}/api/linkedin/callback`,
        // `http://localhost:5000/api/linkedin/callback`,
        {
          params: {
            code: new URLSearchParams(window.location.search).get("code"),
            userId: userId,
          },
        }
      );
      console.log(response.data.accessToken);
      setAccessToken(response.data.accessToken);
      // console.log(setAccessToken);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const handleButtonClick = async () => {
    await handleLinkedInLogin();
    await handleShowAccessToken();
  };

  return (
    <Card
      style={{
        width: "800px",
        padding: "0 0 0 10px",
        backgroundColor: "#ffffff",
      }}
      variant="outlined"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <img src={LinkedIn} />
          <img
            src={LinkedInWord}
            style={{ height: "60px", margin: "auto", marginLeft: "10px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "10px", margin: "24px" }}>
          <Button style={{ backgroundColor: "#231e1f", color: "#ffff" }}>
            <OpenInNewIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={() => {
                window.open("https://www.linkedin.com", "_blank");
              }}
            >
              Open
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#231e1f", color: "#ffff" }}>
            <RefreshIcon />
            <Typography fontWeight={300} fontSize="12px">
              Refresh
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#231e1f", color: "#ffff" }}>
            <LoginIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={handleButtonClick}
            >
              Give Access
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const SocialCardDrive = () => {
  return (
    <Card style={{ width: "800px", padding: "0 0 0 10px" }} variant="outlined">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img src={DriveIcon} style={{ height: "70px", marginLeft: "15px" }} />
        </div>
        <div style={{ display: "flex", gap: "10px", margin: "24px" }}>
          <Button style={{ backgroundColor: "#53575D", color: "#fff" }}>
            <OpenInNewIcon />
            <Typography fontWeight={300} fontSize="12px">
              Open
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#53575D", color: "#fff" }}>
            <RefreshIcon />
            <Typography fontWeight={300} fontSize="12px">
              Refresh
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#53575D", color: "#fff" }}>
            <LoginIcon />
            <Typography fontWeight={300} fontSize="12px">
              Give Access
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};

const SocialCardTwitter = () => {
  const [authUrl, setAuthUrl] = useState("");
  const [userAccessToken, setUserAccessToken] = useState(null);
  const [userAccessTokenSecret, setUserAccessTokenSecret] = useState(null);
  const { userId, userType } = useValue();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("userAccessToken");
    const accessTokenSecret = queryParams.get("userAccessTokenSecret");
    if (accessToken && accessTokenSecret) {
      setUserAccessToken(accessToken);
      setUserAccessTokenSecret(accessTokenSecret);
      console.log("token", accessToken);
      saveTokens(accessToken, accessTokenSecret);
    }
  }, []);

  const saveTokens = async (accessToken, accessSecretToken) => {
    try {
      await axios.post(`${CONST.server}/api/twitter/save-tokens`, {
        userId: userId,
        accessToken: accessToken,
        accessSecretToken: accessSecretToken,
      });
      console.log("Access tokens saved successfully");
    } catch (error) {
      console.error("Error saving access tokens:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${CONST.server}/twitter-login`);
      setAuthUrl(response.data);
      console.log(authUrl);
      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <Card
      style={{ width: "800px", padding: "0 0 0 10px", background: "#202020" }}
      variant="outlined"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <img src={TwitterIcon} />
          <img style={{ height: "30px" }} src={TwitterWord} />
        </div>
        <div style={{ display: "flex", gap: "10px", margin: "24px" }}>
          <Button style={{ backgroundColor: "#1da1f2", color: "white" }}>
            <OpenInNewIcon />
            <Typography
              fontWeight={300}
              fontSize="12px"
              onClick={() => {
                window.open("https://www.twitter.com", "_blank");
              }}
            >
              Open
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#1da1f2", color: "white" }}>
            <RefreshIcon />
            <Typography fontWeight={300} fontSize="12px">
              Refresh
            </Typography>
          </Button>
          <Button style={{ backgroundColor: "#1da1f2", color: "white" }}>
            <LoginIcon />
            <Typography fontWeight={300} fontSize="12px" onClick={handleLogin}>
              Give Access
            </Typography>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default function AccountTest() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        alignItems: "center",
      }}
    >
      <SocialCardDrive />
      <SocialCardInsta />
      <SocialCardLinkedIn />
      <SocialCardFacebook />
      <SocialCardTwitter />
    </div>
  );
}
