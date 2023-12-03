import React from 'react'
import Sidebar from '../../layouts/Sidebar/Sidebar'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import useDrivePicker from "react-google-drive-picker";
import { useState } from 'react';
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { CONST } from "../../../../constants";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import acc from "./../Accounts/Accounts.css" 
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import LogoutIcon from '@mui/icons-material/Logout';
const drawerWidth = 240;

function Accounts() {
  const [openPicker, authResponse] = useDrivePicker();
  const [LoggedIn, setLoggedIn] = useState(
    localStorage.getItem("Glog") === "true"
  );
  const [gAccess, setgAccess] = useState("");
  const [gRefresh, setgRefresh] = useState(null);
  const [side, setside] = useState(true);
  const [show, setshow] = useState(true)
  

  function toggleSideMenu() {
    setside(!side);
    return side;
  }

  function refreshToken() {
    setshow(false)
    axios
      .get(CONST.server + "/token/google/get/" + localStorage.getItem("uid"))
      .then((response) => {
        console.log(response.data.gAccessToken);
        

        axios
          .post(CONST.server + "/auth/google/refresh-token", {
            clientId:
              "753124195649-0v404kl4hekpr1isc16u05c2ai4n02ps.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: response.data.gRefreshToken,
          })
          .then((rsp) => {
            console.log("refreshResponse", rsp.data);
            setgAccess(rsp.data.access_token);
            console.log("AccessTokenSET", rsp.data.access_token);
            axios
              .post(
                CONST.server +
                  "/token/google/set/" +
                  localStorage.getItem("uid"),
                {
                  accessToken: rsp.data.access_token,
                  refreshToken: rsp.data.refresh_token,
                }
              )
              .then((respon) => {
                console.log(respon);
                setshow(true)
                
              })
              .catch((err) => [console.log(err)]);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

      
     
  }

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/drive",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const tokens = await axios.post(CONST.server + "/auth/google", {
        code: codeResponse.code,
      });
      if (tokens.status == 200) {
        console.log(tokens);
        localStorage.setItem("Glog", "true");
        setLoggedIn(true);
        axios
          .post(
            CONST.server + "/token/google/set/" + localStorage.getItem("uid"),
            {
              accessToken: tokens.data.access_token,
              refreshToken: tokens.data.refresh_token,
            }
          )
          .then((respon) => {
            console.log(respon);
          })
          .catch((err) => [console.log(err)]);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    console.log("final gAccess", gAccess);
    openPicker({
      clientId:
        "753124195649-0v404kl4hekpr1isc16u05c2ai4n02ps.apps.googleusercontent.com",
      developerKey: "AIzaSyBaRon09Prj5_WAlRvQd1sEeXnO43mt39Q",
      viewId: "DOCS",
      token: gAccess,
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);
      },
    });
  };
  const scrollbarStyle = {
    '&::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: '#000000',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888888',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#555555',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#000000',
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  };

  return (
    <React.Fragment>
           <Box sx={{ display: 'flex'}} style={scrollbarStyle} >
           {/* <Sidebar/> */}
           <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)`,overflow:"hidden" } }}
      >
        <Toolbar />
        <>
      <div style={{ position: "fixed", top: "0px", zIndex: 1001 }}>
    
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
      
          position: "relative",


          overflow:"hidden",
     
          flexDirection:"column"
        }}
      >
  

  <Card
  sx={{
    maxWidth: 700,
    color: 'white',
    background: 'linear-gradient(to right bottom, #000328, #00458e)',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    transform: 'translateY(-2px)',
  }}
>
  <CardContent>
    <Typography variant="h3" component="h2">
      Google Drive Integration
    </Typography>
    <div>
      {LoggedIn ? (
        <div>
          <Button
            variant={show ? 'contained' : 'disabled'}
            sx={{
              padding: '10px',
              margin: '10px',
              backgroundColor: '#283943',
              color: 'white',
              background: 'linear-gradient(to right bottom, #39406D, #151829)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Add shadow
              '&:hover': {
                transform: 'translateY(-2px)', // Add uplift effect on hover
              },
            }}
            onClick={() => {
              handleOpenPicker();
            }}
          >
            <CloudCircleIcon sx={{ padding: '3px' }} /> Open Drive
          </Button>
          <Button
            variant="contained"
            sx={{
              padding: '10px',
              margin: '10px',
              backgroundColor: '#283943',
              color: 'white',
              background: 'linear-gradient(to right bottom, #39406D, #151829)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Add shadow
              '&:hover': {
                transform: 'translateY(-2px)', // Add uplift effect on hover
              },
            }}
            onClick={() => {
              refreshToken();
            }}
          >
            <RefreshIcon sx={{ padding: '3px' }} /> Refresh
          </Button>
          <Button
            variant={show ? 'contained' : 'disabled'}
            sx={{
              padding: '10px',
              margin: '10px',
              backgroundColor: '#283943',
              color: 'white',
              background: 'linear-gradient(to right bottom, #39406D, #151829)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Add shadow
              '&:hover': {
                transform: 'translateY(-2px)', // Add uplift effect on hover
              },
            }}
            onClick={() => {
              localStorage.setItem('Glog', '');
              window.location = '/gdrive';
            }}
          >
            <LogoutIcon sx={{ padding: '3px' }} /> Logout
          </Button>
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            onClick={() => googleLogin()}
            sx={{
              padding: '10px',
              margin: '10px',
              backgroundColor: '#283943',
              color: 'white',
              background: 'linear-gradient(to right bottom, #39406D, #151829)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Add shadow
              '&:hover': {
                transform: 'translateY(-2px)', // Add uplift effect on hover
              },
            }}
          >
            <CloudCircleIcon sx={{ padding: '3px' }} /> Sign in with Google
          </Button>
          <Button
            variant="contained"
            sx={{
              padding: '10px',
              margin: '10px',
              backgroundColor: '#283943',
              color: 'white',
              background: 'linear-gradient(to right bottom, #39406D, #151829)',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)', // Add shadow
              '&:hover': {
                transform: 'translateY(-2px)', // Add uplift effect on hover
              },
            }}
            onClick={() => {
              googleLogout();
            }}
          >
            <LogoutIcon sx={{ padding: '3px' }} /> Logout
          </Button>
        </div>
      )}
    </div>
  </CardContent>
</Card>

      </div>
    </>
   
      </Box>


           </Box>
       
    </React.Fragment>
  )
}

export default Accounts