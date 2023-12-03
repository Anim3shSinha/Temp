import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ClientInfo.css";
import InstagramIcon from "../../../../assets/Instagram.svg";
import FacebookIcon from "../../../../assets/Facebook-logo.svg";
import LinkedIn from "../../../../assets/linkedin-logo.svg";
import TwitterIcon from "../../../../assets/Twitter-Logo.svg";
import { createChart } from "lightweight-charts";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ShareIcon from "@mui/icons-material/Share";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TimelineIcon from "@mui/icons-material/Timeline";
import { CONST } from "../../../../constants";
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

const ClientInfo = () => {
  const [chart, setChart] = useState(null);
  const [clientName, setClientName] = useState("");
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

  const [clients, setClients] = useState([]);
  const { userType, userId } = useValue();

  const [showStats, setShowStats] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [impressions, setImpressions] = useState(0);

  const handleShowStats = async (platform, likes, comments, impressions) => {
    setSelectedPlatform(platform);
    setLikes(likes);
    setComments(comments);
    setImpressions(impressions);
    setShowStats(true);
  };

  const handleCloseStats = () => {
    if (chart) {
      chart.remove();
      setChart(null);
    }
    setShowStats(false);
  };

  return (
    <div>
      <h2>Select Client</h2>
      <FormControl fullWidth margin="normal">
        <InputLabel>Client Name</InputLabel>
        <Select
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
        >
          <MenuItem value="">--No Client--</MenuItem>
          {clients.map((client) => (
            <MenuItem key={client.id} value={client}>
              {client.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showStats && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedPlatform} Statistics</h3>
              <button onClick={handleCloseStats} className="close-button">
                <CloseIcon />
              </button>
            </div>
            <div
              className="modal-body"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "70%",
              }}
            >
              <div
                className="upper-part"
                style={{
                  display: "flex",
                  minHeight: "70%",
                  // border: "2px solid black",
                }}
              >
                <div
                  className="left-section"
                  style={{
                    width: "25%",

                    height: "100%",
                    textAlign: "center",
                    // border: "2px solid black",
                  }}
                >
                  Page Impression <br /> <br /> <br />
                  <EqualizerIcon /> <br />
                  NAN
                </div>
                <div
                  className="right-section"
                  style={{
                    width: "70%",
                    height: "100%",
                    textAlign: "center",
                    border: "2px solid rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px",
                    color: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <span style={{ color: "black" }}> Your Page Stats </span>
                  <br />
                  <br />
                  No Data Available
                </div>
              </div>
              <div
                className="lower-part"
                style={{
                  height: "30%",
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "5px",
                }}
              >
                <div
                  className="stat-section"
                  style={{
                    width: "33%",
                    height: "100%",

                    // border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                  {/* Likes */}

                  <p>
                    {" "}
                    <ThumbUpOffAltIcon /> <br /> NAN
                  </p>
                </div>
                <div
                  className="stat-section"
                  style={{
                    width: "33%",
                    height: "100%",
                    // border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                  <p>
                    <ShareIcon /> <br /> NAN
                  </p>
                </div>
                <div
                  className="stat-section"
                  style={{
                    width: "33%",
                    height: "100%",
                    // border: "2px solid black",
                    textAlign: "center",
                  }}
                >
                  {/* Comments */}
                  <p>
                    <ReviewsIcon /> <br /> NAN
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="social-media-container">
        <div className="Cards">
          <h3>Social Media Analytics</h3>
          <div className="social-cards-container">
            <div
              className="social-media-card"
              style={{
                backgroundColor: "white",
                width: "250px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="upper-part"
                style={{
                  backgroundColor: "blue",
                  margin: 0,
                  height: "40%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img src={FacebookIcon} alt="Facebook Logo" />
              </div>
              <div
                className="lower-part"
                style={{
                  backgroundColor: "white",
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "black" }}>Connect with friends</p>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    width: "60%",
                    fontSize: "14px",
                    // alignSelf: "flex-end",
                  }}
                  onClick={() => handleShowStats("Facebook", 1000, 300, 5000)}
                >
                  Show Stats
                </Button>
              </div>
            </div>
            <div
              className="social-media-card"
              style={{
                backgroundColor: "white",
                width: "250px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="upper-part"
                style={{
                  backgroundColor: "pink",
                  margin: 0,
                  height: "40%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img src={InstagramIcon} alt="Instagram Logo" />
              </div>
              <div
                className="lower-part"
                style={{
                  backgroundColor: "white",
                  height: "60%",
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "black" }}>Share photos and videos</p>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    width: "60%",
                    fontSize: "14px",
                    // alignSelf: "flex-end",
                  }}
                  onClick={() => handleShowStats("Instagram", 1200, 250, 6000)}
                >
                  Show Stats
                </Button>
              </div>
            </div>
            <div
              className="social-media-card"
              style={{
                backgroundColor: "white",
                width: "250px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="upper-part"
                style={{
                  backgroundColor: "lightblue",
                  margin: 0,
                  height: "40%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img src={TwitterIcon} alt="Twitter Logo" />
              </div>
              <div
                className="lower-part"
                style={{
                  backgroundColor: "white",
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "black" }}>Stay informed</p>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    width: "60%",
                    fontSize: "14px",
                    // alignSelf: "flex-end",
                  }}
                  onClick={() => handleShowStats("Twitter", 800, 200, 4000)}
                >
                  Show Stats
                </Button>
              </div>
            </div>
            <div
              className="social-media-card"
              style={{
                backgroundColor: "white",
                width: "250px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="upper-part"
                style={{
                  backgroundColor: "#0A66C2",
                  margin: 0,
                  height: "40%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img src={LinkedIn} alt="LinkedIn Logo" />
              </div>
              <div
                className="lower-part"
                style={{
                  backgroundColor: "white",
                  height: "60%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ color: "black" }}>
                  Build your professional network
                </p>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    width: "60%",
                    fontSize: "14px",
                    // alignSelf: "flex-end",
                  }}
                  onClick={() => handleShowStats("LinkedIn", 1500, 350, 5500)}
                >
                  Show Stats
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
