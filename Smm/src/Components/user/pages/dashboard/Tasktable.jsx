import * as React from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./TaskTable.css";
import { useValue } from "../../../../contexts/ValueContext";
import { CONST } from "../../../../constants";

function Tasktable() {
  const { userType, userId } = useValue();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const openModal = (description) => {
    setSelectedTaskDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskDescription("");
  };

  const handleTaskClick = (description) => {
    openModal(description);
  };

  useEffect(() => {
    if (userType === "Manager") {
      const fetchManagerTasks = async () => {
        try {
          console.log(userId);
          const response = await axios.post(
            // "http://localhost:5000/get_tasks_by_manager",
            `${CONST.server}/get_tasks_by_manager`,
            {
              managerId: userId,
            }
          );
          setTasks(response.data);
        } catch (error) {
          console.error("Error fetching manager tasks:", error);
        }
      };

      fetchManagerTasks();
    }
    if (userType === "Client") {
      axios
        // .post("http://localhost:5000/get_tasks_by_client", {
        .post(`${CONST.server}/get_tasks_by_client`, {
          clientId: userId,
        })
        .then((response) => setTasks(response.data))
        .catch((error) => console.error("Error fetching tasks:", error));
    }
    if (userType==="Admin") {
      axios
        // .get("http://localhost:5000/get_tasks")
        .get(`${CONST.server}/get_tasks`)
        .then((response) => setTasks(response.data))
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [userId]);

  return (
    <>
      {tasks.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "larger" }}>
          No tasks available
        </p>
      ) : (
        <>
          <Paper style={{ margin: "30px" }}>
            <Table>
              <TableHead style={{ fontWeight: "500px" }}>
                <TableRow>
                  <TableCell>TASK</TableCell>
                  <TableCell>CREADTED BY</TableCell>
                  <TableCell>CREATED ON</TableCell>
                  <TableCell>LAST MODIFIED</TableCell>
                  <TableCell>POST ON</TableCell>
                  <TableCell>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((row, index) => (
                  <TableRow key={row._id}>
                    <TableCell
                      onClick={() => handleTaskClick(row.description)}
                      className="hover-effect"
                    >
                      Task {index + 1}
                    </TableCell>
                    <TableCell onClick={() => handleTaskClick(row.description)}>
                      {row.assignedTo
                        ? row.assignedTo.name
                          ? row.assignedTo.name
                          : "Not Assigned"
                        : "Not Assigned"}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(row.dueDate))} ago
                      {/* {new Date(row.dueDate).toLocaleDateString()} */}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(row.lastModified))} ago
                    </TableCell>
                    <TableCell>{row.site}</TableCell>
                    <TableCell>{row.isCompleted}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <Modal
            open={isModalOpen}
            onClose={closeModal}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box className="modal-content" style={{ display: "flex" }}>
              {/* Left Part */}
              <div style={{ flex: 1, padding: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                  <img alt="Task" style={{ maxWidth: "100%" }} />
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ width: "100%" }}
                >
                  View in Depth
                </Button>
              </div>

              {/* Right Part */}
              <div style={{ flex: 2, padding: "20px" }}>
                <Button
                  className="modal-close-btn"
                  onClick={closeModal}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                  <CloseIcon />
                </Button>
                <h2
                  id="modal-title"
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "10px",
                  }}
                >
                  Task Heading
                </h2>
                <p
                  id="modal-description"
                  style={{
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4, // Number of lines to show before truncating with ellipsis
                  }}
                >
                  {selectedTaskDescription}
                </p>
              </div>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
}

export default Tasktable;
