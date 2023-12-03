import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import Logo from "../../../../assets/logo.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// import IconButton from "@mui/material/IconButton";

const pages = [];
const settings = [];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      style={{ backgroundColor: "#192440", padding: "10px" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <LogoDevIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            {/* <img
              src={Logo}
              alt="logo"
              style={{ width: "40%", height: "40%" }}
            /> */}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
          {/* <LogoDevIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <NotificationsNoneIcon
                  sx={{ color: "white" }}
                  fontSize="large"
                />

                <Toolbar />
                <Box
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
                  <Typography
                    variant="h6"
                    style={{ right: "20px", color: "#697A8D" }}
                  >
                    {localStorage.getItem("uname")
                      ? localStorage.getItem("uname")
                      : "undefined"}
                  </Typography>
                </Box>

                {/* <Avatar
                  alt="Remy Sharp"
                  src=""
                  sx={{ width: 50, height: 50, marginLeft: "20px" }}
                />

                <Typography
                  variant="h6"
                  style={{ margin: "20px", color: "white" }}
                >
                  Anik Ghosh
                </Typography> */}

                <KeyboardArrowDownIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            {/* <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
