import React, { useState } from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Navbar from "../../layouts/Navbar/Navbar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Button, Divider } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddIcon from "@mui/icons-material/Add";
import RequireTable from "./RequireTable";
import ClientTable from "./ClientTable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NewTask from "./NewTask";
import ManagerTable from "./ManagerTable";
import { useValue } from "../../../../contexts/ValueContext";

function Requirements() {
  const { userType } = useValue();
  const drawerWidth = 240;
  const [showAddForm, setShowAddForm] = useState(false);

  const handleNewRequirementClick = () => {
    setShowAddForm(true);
  };

  const handleBackButton = () => {
    setShowAddForm(false);
  };

  return (
    <>
      {/* <Navbar /> */}
      {showAddForm ? (
        <>
          <Box sx={{ display: "flex" }}>
            {/* <Sidebar /> */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "10px",
                    color: "black",
                  }}
                  // variant="contained"
                  onClick={handleBackButton}
                >
                  <ArrowBackIcon />
                </Button>
                <h2>Send a new Requirement </h2>
              </div>
              <Divider />
              <NewTask />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <div style={{ width: "100%" }}>
            <Box>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "10px",
                  }}
                  variant="contained"
                  color="warning"
                >
                  <CalendarMonthIcon />
                  Calender
                </Button>
                {userType === "Client" && (
                  <Button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "10px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={handleNewRequirementClick}
                  >
                    <AddIcon /> New Requirement
                  </Button>
                )}
              </div>
              <Divider />
            </Box>
            <Box sx={{ display: "flex" }}>
              {/* <Sidebar /> */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
              >
                <Toolbar />
                {userType === "Admin" && <RequireTable />}
                {userType === "Manager" && <ManagerTable />}
                {userType === "Client" && <ClientTable />}
              </Box>
            </Box>
          </div>
        </>
      )}
    </>
  );
}

export default Requirements;
