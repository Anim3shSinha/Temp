import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
// import React from "react";
import incsvg from "../../../../assets/inc.svg";
import decsvg from "../../../../assets/dec.svg";
import profilesvg from "../../../../assets/profile-2user.svg";
import mdi from "../../../../assets/mdi_blog-outline.svg";
import clock from "../../../../assets/fe_clock.svg";
import React, { useState } from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Navbar from "../../layouts/Navbar/Navbar";
import { Divider } from "@mui/material";
import Tasktable from "./Tasktable";
import Calender from "./Calender";
import { useValue } from "../../../../contexts/ValueContext";
const drawerWidth = 240;

const TopCard = (props) => {
  const isNeg = props.data1 < 0;
  const dataPercent = isNeg ? -1 * props.data1 : props.data1;

  const svg =
    props.title === "Total employees"
      ? profilesvg
      : props.title === "Total posts"
      ? mdi
      : clock;

  return (
    <Card
      sx={{
        minWidth: 306,
        minHeight: 176,
        borderRadius: "24px",
        backgroundColor: "#192440",
      }}
    >
      <CardContent>
        <div
          style={{
            margin: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "80px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                backgroundColor: "#5054D9",
                height: "28px",
                padding: "4px",
                width: "28px",
                display: "flex",
                justifyContent: "space-evenly",
                alignContent: "space-evenly",
              }}
            >
              <img style={{ width: "19px", height: "19px" }} src={svg}></img>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <img src={isNeg ? decsvg : incsvg} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography fontSize="20px" fontWeight={600} color="white">
                  {dataPercent + "%"}
                </Typography>
                <Typography color="#B6B7BC" fontWeight={300} fontSize="12px">
                  This Month
                </Typography>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: "35px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography color="#B6B7BC" fontWeight={300} fontSize="15px">
                {props.title}
              </Typography>
              <Typography fontSize="30px" fontWeight={600} color="white">
                {props.data2}
              </Typography>
            </div>
            <Button
              style={{
                borderRadius: "20px",
                padding: "12px",
                backgroundColor: "#5054D9",
                color: "white",
              }}
            >
              {" "}
              See Info{" "}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DashboardTest() {
  const [showComponentOne, setShowComponentOne] = useState(true);
  const { userType, userId } = useValue();
  const handleShowComponentTwo = () => {
    setShowComponentOne(false);
  };

  const handleShowComponentOne = () => {
    setShowComponentOne(true);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      type : {userType}
      <br /> id : {userId}
      {userType === "Admin" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: "10px",
          }}
        >
          <TopCard data1={1.2} data2={100} title={"Total employees"} />
          <TopCard data1={-1.2} data2={"1K"} title={"Total posts"} />
          <TopCard data1={4} data2={40} title={"Pending Posts"} />
        </div>
      )}
      <Box
        component="main"
        sx={{
          position: "absolute",
          // top: "80px",
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
            {userType !== "Admin" && (
              <>
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
              </>
            )}

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
    </div>
  );
}
