import React, { useState } from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Navbar from "../../layouts/Navbar/Navbar";
import { Divider } from "@mui/material";
import Tasktable from "./Tasktable";
import Calender from "./Calender";
import { useValue } from "../../../../contexts/ValueContext";
const drawerWidth = 240;

function Dashboard() {
  const [showComponentOne, setShowComponentOne] = useState(true);
  const { userType } = useValue();
  const handleShowComponentTwo = () => {
    setShowComponentOne(false);
  };

  const handleShowComponentOne = () => {
    setShowComponentOne(true);
  };
  return (
    <React.Fragment>
      <Box
        component="main"
        sx={{
          position: "absolute",
          top: "80px",
          right: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {showComponentOne && (
          <Box>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px",
                }}
                variant="contained"
                color="primary"
                onClick={handleShowComponentTwo}
              >
                <CalendarMonthIcon />
                Calender
              </Button>
            </div>
            <Divider />

            <div>
              <Tasktable />
            </div>
          </Box>
        )}

        {!showComponentOne && (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                borderBottom: "2px solid black",
                width: "100%",
              }}
            >
              <Button
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px",
                  backgroundColor: "white",
                  color: "black",
                }}
                variant="contained"
                onClick={handleShowComponentOne}
              >
                <KeyboardBackspaceIcon />
                Calender
              </Button>
            </div>
            <Divider />
            <Calender />
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}

export default Dashboard;
