import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
  Outlet,
} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MediaEditor from "./Components/user/pages/MediaEditor/MediaEditor";
import DashboardTest from "./Components/user/pages/dashboard/Dashboard_test";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Dashboard from "./Components/user/pages/dashboard/dashboard";
import Contents from "./Components/user/pages/Contents/Contents";
import Requirements from "./Components/user/pages/Requirements/Requirement";
import GPT from "./Components/user/pages/GPT/GPT";
import Accounts from "./Components/user/pages/Accounts/Accounts";
import ClientInfo from "./Components/user/pages/ClientInformation/ClientInfo";
import { GoogleOAuthProvider } from "@react-oauth/google";
import logo from "./assets/logo.png";
import AccountTest from "./Components/user/pages/Accounts/Account_test";
import SignUp from "./Components/user/pages/Signup/signup";
import Login from "./Components/user/pages/Login/login";
import { useValue } from "./contexts/ValueContext";
import Homepage from "./Components/user/layouts/HomePage/Home";
import PrivacyPolicy from "./Components/user/layouts/HomePage/Privacy";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `100%`,
    // marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [item, setItem] = React.useState("Home");

  const handleDrawer = () => {
    setOpen(!open);
  };

  const { userType } = useValue();

  return (
    <Router>
      <GoogleOAuthProvider clientId="753124195649-0v404kl4hekpr1isc16u05c2ai4n02ps.apps.googleusercontent.com">
        <Routes>
          <Route
            exact
            path="/home"
            element={
              <div
                style={{
                  display: "flex",
                  marginLeft: open ? "10px" : -1 * drawerWidth,
                  transition: "ease-out",
                  transitionDuration: "0.2s",
                }}
              >
                <CssBaseline />
                <AppBar
                  elevation={0}
                  position="fixed"
                  open={open}
                  style={{
                    backgroundColor: "#192440",
                    padding: "2px",
                    zIndex: theme.zIndex.drawer + 1,
                  }}
                >
                  <Toolbar>
                    <div
                      style={{
                        margin: "0 10 0 10",
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          onClick={handleDrawer}
                          edge="start"
                        >
                          <MenuIcon />
                        </IconButton>
                        <img style={{ maxHeight: "40px" }} src={logo} />
                      </div>
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                        }}
                      >
                        <IconButton>
                          <NotificationsNoneIcon sx={{ color: "white" }} />
                        </IconButton>
                        <IconButton>
                          <AccountCircleIcon style={{ color: "whitesmoke" }} />
                        </IconButton>
                        <Typography
                          variant="h6"
                          style={{ color: "whitesmoke" }}
                        >
                          {localStorage.getItem("uname")
                            ? localStorage.getItem("uname")
                            : "undefined"}
                        </Typography>
                        <IconButton>
                          <KeyboardArrowDownIcon sx={{ color: "whitesmoke" }} />
                        </IconButton>
                      </div>
                    </div>
                  </Toolbar>
                </AppBar>

                <Main
                  style={{
                    height: "90%",
                    // border: "solid black 2px",
                    marginTop: "70px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Drawer
                    sx={{
                      width: drawerWidth,
                      flexShrink: 0,
                      "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#192540",
                      },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                  >
                    <DrawerHeader style={{ height: "100px" }}></DrawerHeader>
                    <List>
                      <Link
                        to="/home/Dashboard"
                        style={{
                          textDecoration: "none",
                          color: "whitesmoke",
                        }}
                      >
                        <ListItem
                          disablePadding
                          onClick={() => {
                            setItem("Home");
                          }}
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <HomeIcon style={{ color: "whitesmoke" }} />
                            </ListItemIcon>
                            <ListItemText primary={"Home"} />
                          </ListItemButton>
                        </ListItem>
                      </Link>
                      {userType == "Manager" && (
                        <Link
                          to="/home/MediaEditor"
                          style={{
                            textDecoration: "none",
                            color: "whitesmoke",
                          }}
                        >
                          <ListItem
                            disablePadding
                            onClick={() => {
                              setItem("MediaEditor");
                            }}
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <SlideshowIcon
                                  style={{ color: "whitesmoke" }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={"MediaEditor"} />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      )}

                      {userType === "Manager" && (
                        <Link
                          to="/home/Contents"
                          style={{
                            textDecoration: "none",
                            color: "whitesmoke",
                          }}
                        >
                          <ListItem
                            disablePadding
                            onClick={() => {
                              setItem("Contents");
                            }}
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <PermMediaIcon sx={{ color: "whitesmoke" }} />
                              </ListItemIcon>
                              <ListItemText primary={"Contents"} />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      )}

                      {userType !== "Client" && (
                        <Link
                          to="/home/ClientInfo"
                          style={{
                            textDecoration: "none",
                            color: "whitesmoke",
                          }}
                        >
                          <ListItem
                            onClick={() => {
                              setItem("ClientInfo");
                            }}
                            disablePadding
                            style={{ backgroundColor: "inherit" }}
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <SlideshowIcon
                                  sx={{
                                    color: "whitesmoke",
                                  }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={"Analytics"}>
                                <IconButton>
                                  <KeyboardArrowDownIcon />
                                </IconButton>
                              </ListItemText>
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      )}

                      <Link
                        to="/home/Requirements"
                        style={{
                          textDecoration: "none",
                          color: "whitesmoke",
                        }}
                      >
                        <ListItem
                          onClick={() => {
                            setItem("Requirements");
                          }}
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <ContactEmergencyIcon
                                sx={{
                                  color: "whitesmoke",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={"Requirements"} />
                          </ListItemButton>
                        </ListItem>
                      </Link>

                      {userType === "Manager" && (
                        <Link
                          to="/home/GPT"
                          style={{
                            textDecoration: "none",
                            color: "whitesmoke",
                          }}
                        >
                          <ListItem
                            onClick={() => {
                              setItem("GPT");
                            }}
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <PsychologyIcon sx={{ color: "whitesmoke" }} />
                              </ListItemIcon>
                              <ListItemText primary={"GPT"} />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      )}

                      {userType === "Client" && (
                        <Link
                          to="/home/Accounts"
                          style={{
                            textDecoration: "none",
                            color: "whitesmoke",
                          }}
                        >
                          <ListItem
                            onClick={() => {
                              setItem("Accounts");
                            }}
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <ManageAccountsIcon
                                  sx={{ color: "whitesmoke" }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={"Accounts"} />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      )}
                    </List>
                    <Divider
                      style={{
                        margin: "10px 10px 10px 10px",
                        backgroundColor: "whitesmoke",
                      }}
                    />
                    <List>
                      <Link
                        to="/Login"
                        style={{
                          textDecoration: "none",
                          color: "whitesmoke",
                        }}
                      >
                        <ListItem
                          onClick={() => {
                            setItem("Login");
                          }}
                          disablePadding
                          style={{
                            backgroundColor:
                              item === "Login" ? "#5054D9" : "inherit",
                          }}
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <LogoutIcon sx={{ color: "whitesmoke" }} />
                            </ListItemIcon>
                            <ListItemText primary={"Log out"} />
                          </ListItemButton>
                        </ListItem>
                      </Link>
                    </List>
                  </Drawer>
                  <Outlet />
                </Main>
              </div>
            }
          >
            <Route index path="/home/Dashboard" element={<DashboardTest />} />
            <Route path="/home/MediaEditor" element={<MediaEditor />} />
            <Route path="Contents" element={<Contents />} />
            <Route path="ClientInfo" element={<ClientInfo />} />
            <Route path="Requirements" element={<Requirements />} />
            <Route path="GPT" element={<GPT />} />
            <Route path="Accounts" element={<AccountTest />} />
          </Route>

          <Route path="/Login" exact element={<Login />} />
          <Route path="/" exact element={<Homepage />} />
          <Route path="/Signup" exact element={<SignUp />} />
          <Route path="/Privacy" exact element={<PrivacyPolicy />} />
        </Routes>
      </GoogleOAuthProvider>
    </Router>
  );
}
