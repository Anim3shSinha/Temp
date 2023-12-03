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

function RequireTable() {
  const { userType, userId } = useValue();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  const handleBackButton = () => {
    setSelectedTask(null);
  };

  const handleCompleteTask = async (selectedTask) => {
    try {
      const taskId = selectedTask._id;
      // await axios.put(`http://localhost:5000/update_tasks/${taskId}`, {
      await axios.put(`${CONST.server}/update_tasks/${taskId}`, {
        isCompleted: "Completed",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    axios
      // .get("http://localhost:5000/get_tasks")
      .get(`${CONST.server}/get_tasks`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/get_managers");
      const response = await axios.get(`${CONST.server}/get_managers`);
      setManagers(response.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleManagerSelect = async (managerId) => {
    try {
      const response = await axios.post(
        // "http://localhost:5000/get_manager_id",
        `${CONST.server}/get_manager_id`,
        {
          id: managerId,
        }
      );
      setSelectedManager(response.data);
      console.log(selectedManager);
    } catch (error) {
      console.error("Error getting manager by ID:", error);
    }
  };

  const assignTaskToManager = async (taskId, managerId) => {
    try {
      // await axios.post("http://localhost:5000/assign_task", {
      axios
        .post(`${CONST.server}/assign_task`, {
          taskId: taskId,
          managerId: managerId,
        })
        .then((response) => {
          window.location.reload();
        });
    } catch (error) {
      console.error("Error assigning task to manager:", error);
    }
  };

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

        {/* //////////////////////////////////////Super Admin View ///////////////////////////////////////// */}
        {userType === "Admin" && (
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Task</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Media</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Assign</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{tasks.indexOf(selectedTask) + 1}</TableCell>
                    <TableCell>
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{selectedTask.site}</TableCell>

                    {selectedTask.assignedTo ? (
                      <TableCell>{selectedTask.assignedTo.name}</TableCell>
                    ) : (
                      <TableCell>
                        <select
                          onChange={(e) => handleManagerSelect(e.target.value)}
                          value={selectedManager ? selectedManager._id : ""}
                        >
                          <option value="">Select a manager</option>
                          {managers.map((manager) => (
                            <option key={manager._id} value={manager._id}>
                              {manager.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                    )}

                    <TableCell>
                      <Button
                        color="success"
                        variant="contained"
                        onClick={() =>
                          assignTaskToManager(
                            selectedTask._id,
                            selectedManager._id
                          )
                        }
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* //////////////////////////////Manager View////////////////////////////////////// */}
        <Divider />
        <div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Media</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{tasks.indexOf(selectedTask) + 1}</TableCell>
                  <TableCell>
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{selectedTask.site}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        backgroundColor: "#D7DAD6",
                        padding: "7px 16px 7px 16px",
                      }}
                    >
                      {selectedTask.isCompleted}
                    </span>
                  </TableCell>

                  {userType === "Manager" && (
                    <TableCell>
                      {selectedTask.isCompleted !== "Completed" ? (
                        <Button
                          color="success"
                          variant="contained"
                          onClick={() => handleCompleteTask(selectedTask)}
                        >
                          Mark as complete
                        </Button>
                      ) : (
                        <Button color="primary" variant="contained">
                          Completed
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Divider />

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
              justifyContent: "space-evenly",
              flexDirection: "row",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <div>
              <Typography variant="h7">Requirement</Typography>
            </div>
            <div>
              <Typography variant="h7">Client Name</Typography>
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
                  value={`Requirement ${index + 1}`}
                />
              </div>
              <div>
                {" "}
                <TextField
                  id="standard-basic"
                  variant="standard"
                  value={row.client}
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

export default RequireTable;
