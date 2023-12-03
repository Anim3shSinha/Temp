import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useValue } from "../../../../contexts/ValueContext";
import { CONST } from "../../../../constants";
import { useNavigate } from "react-router-dom";
import "./Requirement.css";

function NewTask({ handleBackButton }) {
  // const navigate = useNavigate();
  const { userId } = useValue();
  const [clientName, setClientName] = useState("");
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [formData, setFormData] = useState({
    site: "",
    client: "",
    postNumber: "",
    addInfo: "",
    dueDate: "",
    clientId: "",
    lastModified: "",
    description: "",
    topic: "",
    alertVisible: true,
  });

  useEffect(() => {
    if (userId) {
      fetchClientName(userId);
    }
  }, [userId]);

  const fetchClientName = async (clientId) => {
    try {
      const response = await axios.get(
        `${CONST.server}/get_client/${clientId}`
      );
      // console.log(response.data);
      setClientName(response.data.name);
      const platforms = response.data.socialMedia.map((item) => item.platform);
      setAvailablePlatforms(platforms);
      // console.log(availablePlatforms);
      setFormData((prevData) => ({
        ...prevData,
        lastModified: new Date(),
        clientId: response.data._id,
        client: response.data.name,
      }));
      // navigate("/Requirements");
    } catch (error) {
      console.error("Error fetching client name:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post(`${CONST.server}/add_task`, formData);
      console.log("New task added:", response.data);
      setFormData({
        site: "",
        postNumber: "",
        dueDate: "",
        description: "",
        topic: "",
        addInfo: "",
        alertVisible: true,
      });
      setTimeout(() => {
        setFormData((prevData) => ({
          ...prevData,
          alertVisible: false,
        }));
      }, 2000);

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  const inputStyles = {
    background: "#E9E9E9",
  };

  const formContainerStyles = {
    display: "flex",
    flexDirection: "column",
    width: "100vh",
  };

  const textFieldStyles = {
    width: "100%",
    marginBottom: "10px",
  };

  return (
    <>
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vh",
        }}
      >
        {/* <div className={`alert ${formData.alertVisible ? "show" : ""}`}>
          Form submitted successfully!
        </div> */}
        <br />
        <form onSubmit={handleFormSubmit} style={formContainerStyles}>
          {/* userid : {userId} */}
          <div>
            <Typography> Post Topic</Typography>
            <TextField
              style={textFieldStyles}
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{ style: inputStyles }}
            />
          </div>
          <div>
            <Typography>SocialMeida Site</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="site-select">
                {availablePlatforms.length === 0
                  ? "Access not given to any site"
                  : "Available Site"}
              </InputLabel>
              <Select
                value={formData.site}
                onChange={handleInputChange}
                label="Site"
                inputProps={{
                  name: "site",
                  id: "site-select",
                }}
                variant="outlined"
                disabled={availablePlatforms.length === 0}
              >
                {availablePlatforms.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Typography>Total Number of Post</Typography>
            <TextField
              style={textFieldStyles}
              name="postNumber"
              value={formData.postNumber}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{ style: inputStyles }}
            />
          </div>
          <div>
            <Typography>Describe the work</Typography>
            <TextField
              style={textFieldStyles}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{ style: inputStyles }}
            />
          </div>
          <div>
            <Typography>Additional Info</Typography>
            <TextField
              style={textFieldStyles}
              name="addInfo"
              value={formData.addInfo}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              margin="normal"
              InputProps={{ style: inputStyles }}
            />
          </div>

          <div>
            <Typography>Due Date</Typography>
            <TextField
              style={textFieldStyles}
              fullWidth
              label=""
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleInputChange}
              margin="normal"
            />
          </div>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
}

export default NewTask;
