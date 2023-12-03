import * as React from "react";
import PropTypes from "prop-types";
import Logo from "../../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";

const drawerWidth = 240;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [select, setselect] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  function logout() {
    localStorage.clear();
    setTimeout(() => {
      navigate("/Login");
    }, 500);
  }

  function selected(item) {
    console.log(item);
    console.log(localStorage.getItem("selected") === item);
    return localStorage.getItem("selected") === item;
  }
  function setselected(item) {
    localStorage.setItem("selected", item);
  }
  const theme = createTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: "#FFFFFF",
      },
      secondary: {
        // This is green.A700 as hex.
        main: "#11cb5f",
      },
    },
  });

  const buttons = {
    color: "#697A8D",
    "&& .Mui-selected, && .Mui-selected:hover": {
      color: "white",
      backgroundColor: "#4F55DA",
    },
    paddingBottom: "10px",
    borderRadius: "20%",
  };

  const drawer = (
    <div>
      {/* <Toolbar /> */}
      {/* <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          paddingBottom: "10px",
        }}
      >
        <AccountCircleIcon
          fontSize="large"
          style={{ color: "white", right: "20px", cursor: "pointer" }}
          onClick={() => {
            navigate("/profile");
          }}
        />
      </Box> 
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <Typography variant="h6" style={{ right: "20px", color: "#697A8D" }}>
          {localStorage.getItem("uname")
            ? localStorage.getItem("uname")
            : "undefined"}
        </Typography>
      </Box> */}

      {/* <Divider /> */}

      <List>
        <ListItem disablePadding sx={buttons}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              height: "100%",
              width: "100%",
              marginBottom: "5px",
              padding: "20px",
            }}
          />
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            navigate("/");
            setselected("/");
          }}
          sx={buttons}
        >
          <ListItemButton selected={selected("/")}>
            <ListItemIcon>
              {
                <HomeIcon
                  sx={{ color: selected("/") ? "#FFFFFF" : "#697A8D" }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            navigate("/MediaEditor");
            setselected("/MediaEditor");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/MediaEditor")}>
            <ListItemIcon>
              {
                <SlideshowIcon
                  sx={{
                    color: selected("/MediaEditor") ? "#FFFFFF" : "#697A8D",
                  }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"MediaEditor"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          onClick={() => {
            navigate("/Contents");
            setselected("/Contents");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/Contents")}>
            <ListItemIcon>
              {
                <PermMediaIcon
                  sx={{ color: selected("Contents") ? "#FFFFFF" : "#697A8D" }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"Contents"} />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            navigate("/ClientInfo");
            setselected("/ClientInfo");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/ClientInfo")}>
            <ListItemIcon>
              {
                <SlideshowIcon
                  sx={{
                    color: selected("/ClientInfo") ? "#FFFFFF" : "#697A8D",
                  }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"Client Information Panel"} />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          onClick={() => {
            navigate("/Requirements");
            setselected("/Requirements");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/Requirements")}>
            <ListItemIcon>
              {
                <ContactEmergencyIcon
                  sx={{
                    color: selected("/Requirements") ? "#FFFFFF" : "#697A8D",
                  }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"Requirements"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          onClick={() => {
            navigate("/GPT");
            setselected("/GPT");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/GPT")}>
            <ListItemIcon>
              {
                <PsychologyIcon
                  sx={{ color: selected("/GPT") ? "#FFFFFF" : "#697A8D" }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"GPT"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          onClick={() => {
            navigate("/Accounts");
            setselected("/Accounts");
          }}
          sx={buttons}
        >
          <ListItemButton id="l2" selected={selected("/Accounts")}>
            <ListItemIcon>
              {
                <ManageAccountsIcon
                  sx={{ color: selected("/Accounts") ? "#FFFFFF" : "#697A8D" }}
                />
              }
            </ListItemIcon>
            <ListItemText primary={"Accounts"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingTop: "100px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#E7C345",
            ":hover": { backgroundColor: "red" },
          }}
          style={{ right: "20px" }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          mr: 2,
          display: { sm: "none" },
          top: "10px",
          position: "fixed",
          left: "10px",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#192540",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#192540",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Sidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Sidebar;
