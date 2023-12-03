import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useValue } from "../../../../contexts/ValueContext";
import { CONST } from "../../../../constants";

const ClientForm = () => {
  const [clients, setClients] = useState([]);
  // const [clients, setClients] = useState([
  //   { id: "someClientId1", name: "Saket" },
  //   { id: "someClientId2", name: "Anik Ghosh" },
  //   // Add more clients as needed
  // ]);
  const { userType, userId } = useValue();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.post(`${CONST.server}/clients-for-manager`, {
        userId: userId,
      });
      const { clients } = response.data;
      setClients(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const [clientName, setClientName] = useState("");
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSite, setSelectedSite] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    setSelectedVideo(file);
  };

  const handleSubmit = async (event) => {
    console.log(clientName);
    console.log(postText);
    console.log(selectedDate);
    console.log(selectedTime);
    console.log(selectedSite);
    event.preventDefault();
    try {
      const formData = {
        pageAccessToken:
          "EAANoazt1YKYBO85fQJfsdnu8jaibeu05PccJsTrbcgnsdL5Ca8LzdogBtK58isfcr4MSfdGbZBsz7bgq74DZCB7ZALojBhLgpO4xW316YKdWEIVXJ0ZC8pSDcd9HRXjzccB0sobeTQFdhXnBVAk3TFZAxQAXH6wex80wKK5mPLxe7kgfEzZB1G0LPUWGLD70Swla3xknUZD",
        pageId: "109798618876119",
        message: postText, // Assuming you have a postText state in your component
        scheduleTime: `${selectedDate}T${selectedTime}:00`, // Assuming you have selectedDate and selectedTime states
      };

      // Make the POST request to your server
      const response = await axios.post(
        "http://localhost:5000/api/schedule-facebook-post",
        formData
      );

      // Handle the response as needed
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error sending form data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Create Post
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Client Name</InputLabel>
        <Select
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.name}>
              {client.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Post Text"
        value={postText}
        onChange={(event) => setPostText(event.target.value)}
        margin="normal"
      />
      <h4>Choose image</h4>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* <h4>Choose video</h4>
      <input type="file" accept="video/*" onChange={handleVideoChange} /> */}
      <TextField
        fullWidth
        label="Date"
        type="date"
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Time"
        type="time"
        value={selectedTime}
        onChange={(event) => setSelectedTime(event.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Site"
        value={selectedSite}
        onChange={(event) => setSelectedSite(event.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default ClientForm;
