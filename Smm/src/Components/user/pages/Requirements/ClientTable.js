import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useValue } from "../../../../contexts/ValueContext";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Button from "@mui/material/Button";
import {
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { CONST } from "../../../../constants";

function ClientTable() {
  const { userType, userId } = useValue();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const handleBackButton = () => {
    setSelectedTask(null);
  };

  useEffect(() => {
    axios
      // .post("http://localhost:5000/get_tasks_by_client", {
      .post(`${CONST.server}/get_tasks_by_client`, {
        clientId: userId,
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  let content;

  if (tasks.length === 0) {
    content = (
      <p style={{ textAlign: "center", fontSize: "larger" }}>
        No Requirements available
      </p>
    );
  } else if (selectedTask) {
    content = (
      <>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button color="primary" onClick={handleBackButton}>
            <ArrowBackIcon />
          </Button>
          <h2> View Task Details </h2>
        </div>

        {/* ///////////////////////////////////////////// Client View///////////////////////////////////// */}

        <Divider />
        <div>
          <h3 style={{ color: "blue" }}>Primary Requirements</h3>

          <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Requirement {tasks.indexOf(selectedTask) + 1}
          </p>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Client Name</span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {selectedTask.client.toUpperCase()}
            </p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>SocialMeida </span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {selectedTask.site.toUpperCase()}
            </p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Required Number of Post</span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {selectedTask.postNumber ? selectedTask.postNumber : "0"}
            </p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Deadline</span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {new Date(selectedTask.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ color: "blue" }}>Additional Information</h3>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Post Description</span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {selectedTask.description}
            </p>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>
              Additional Information (Optional)
            </span>{" "}
            <p style={{ backgroundColor: "#f0f0f0", padding: "5px" }}>
              {selectedTask.addInfo}
            </p>
          </div>
        </div>
      </>
    );
  } else {
    content = (
      <Card
        sx={{
          width: "100%",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          transform: "translateY(-2px)",
        }}
      >
        <CardContent>
          <div style={{ display: "flex", justifyContent: "left" }}>
            <Typography variant="h6">
              <strong>Requirements</strong>
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: "30px",
              // border: "2px solid black",
              // textAlign: "right",
            }}
          >
            <div>
              <Typography variant="h7">Socail Meida Site</Typography>
            </div>
            <div>
              <Typography variant="h7">Assigned To</Typography>
            </div>
            <div>
              <Typography variant="h7">Date</Typography>
            </div>
            <div>
              <Typography variant="h7">Task Details</Typography>
            </div>
            <div>
              <Typography variant="h7">Status</Typography>
            </div>
          </div>

          {tasks.map((row, index) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                marginTop: "30px",
              }}
              key={index}
            >
              <div>
                {" "}
                <TextField
                  id="standard-basic"
                  variant="standard"
                  value={row.site}
                />
              </div>
              <div>
                {" "}
                <TextField
                  id="standard-basic"
                  variant="standard"
                  value={
                    row.assignedTo
                      ? row.assignedTo.name
                        ? row.assignedTo.name
                        : "Not Assigned"
                      : "Not Assigned"
                  }
                />
              </div>
              <div>
                {" "}
                <TextField
                  id="standard-basic"
                  variant="standard"
                  value={new Date(row.dueDate).toLocaleDateString()}
                />
              </div>
              <div>
                {" "}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedTask(row)}
                >
                  View Task
                </Button>
              </div>

              <div>
                {" "}
                <TextField
                  id="standard-basic"
                  variant="standard"
                  value={row.isCompleted}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return <>{content}</>;
}

export default ClientTable;
