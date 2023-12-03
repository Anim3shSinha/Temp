import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AddPost from "./AddPost";
import bg from "../../../../assets/dashboard.png";
import axios from "axios";
import { CONST } from "../../../../constants";
// import { Select } from "@mui/material";
import { Base64 } from "js-base64";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import img404 from "../../../../assets/404Img.jpg";
import { useValue } from "../../../../contexts/ValueContext";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const drawerWidth = 240;
function Contents() {
  const { userType, userId } = useValue();
  const [selectedImages, setSelectedImages] = useState([]);
  const [side, setSide] = useState(true);
  const [mode, setMode] = useState("images");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setMode(newValue);
  };

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const addToPost = (imageId, num) => {
    // Construct the image link based on the imageId
    if (num === "img") {
      const imageLink =
        CONST.server +
        "/public/" +
        localStorage.getItem("uid") +
        "/images/" +
        imageId +
        ".jpg";

      // Add the image link to the selectedImages array
      setSelectedImages([...selectedImages, imageLink]);
    } else {
      const imageLink =
        CONST.server +
        "/public/" +
        localStorage.getItem("uid") +
        "/videos/" +
        imageId +
        ".mp4";

      // Add the image link to the selectedImages array
      setSelectedImages([...selectedImages, imageLink]);
    }
  };

  useEffect(() => {
    axios
      .get(CONST.server + "/store/images/get/" + localStorage.getItem("uid"))
      .then((response) => {
        setImages(response.data.images);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(CONST.server + "/store/videos/get/" + localStorage.getItem("uid"))
      .then((response) => {
        setVideos(response.data.videos);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function toggleSideMenu() {
    setSide(!side);
    return side;
  }
  const scrollbarStyle = {
    "&::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "#000000",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888888",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555555",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#000000",
    },
    "&::-webkit-scrollbar-button": {
      display: "none",
    },
  };

  const ClientForm = () => {
    const [clients, setClients] = useState([]);
    const [clientName, setClientName] = useState("");
    const [postText, setPostText] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSite, setSelectedSite] = useState("");
    const [availablePlatforms, setAvailablePlatforms] = useState([]);

    useEffect(() => {
      fetchClients();
    }, []);

    const fetchClients = async () => {
      // console.log(userId);
      try {
        const response = await axios.post(
          `${CONST.server}/clients-for-manager`,
          {
            userId: userId,
          }
        );
        const { clients } = response.data;
        setClients(clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    useEffect(() => {
      if (clientName) {
        const platforms = clientName.socialMedia.map((item) => item.platform);
        setAvailablePlatforms(platforms);
      } else {
        setAvailablePlatforms([]);
      }
    }, [clientName]);

    const handleSubmit = async (event) => {
      event.preventDefault();

      console.log(clientName._id);
      console.log(postText);
      console.log(selectedDate);
      console.log(selectedImages);
      console.log(selectedTime);
      console.log(selectedSite);
      console.log(`${selectedDate}T${selectedTime}:00`);

      if (!clientName || !selectedDate || !selectedTime || !selectedSite) {
        alert("Please fill in all other fields before submitting.");
        return;
      }
      if (!postText && selectedImages.length === 0) {
        alert("Please enter post text or an image.");
        return;
      }

      if (selectedSite === "facebook") {
        try {
          let pageId = "";
          let accessToken = "";
          const facebookPlatform = clientName.socialMedia.find(
            (entry) => entry.platform === "facebook"
          );
          if (facebookPlatform) {
            pageId = facebookPlatform.id;
            accessToken = facebookPlatform.accessToken;
            // console.log("Facebook ID:", facebookId);
          } else {
            console.log("Facebook platform not found in social media");
          }
          if (selectedImages.length > 0) {
            const selectedFileExtension = selectedImages[0]
              .split(".")
              .pop()
              .toLowerCase();
            if (selectedFileExtension === "mp4") {
              console.log("sadf");
              const response = await axios.post(
                `${CONST.server}/api/schedule-facebook-video`,
                {
                  pageAccessToken: accessToken,
                  pageId: pageId,
                  photoUrl: selectedImages[0],
                  message: postText,
                  scheduleTime: `${selectedDate}T${selectedTime}:00`,
                }
              );
              console.log("Video post scheduled successfully:", response.data);
            } else {
              const response = await axios.post(
                `${CONST.server}/api/schedule-facebook-photo`,
                {
                  pageAccessToken: accessToken,
                  pageId: pageId,
                  message: postText,
                  photoUrl: selectedImages[0],
                  scheduleTime: `${selectedDate}T${selectedTime}:00`,
                }
              );
              console.log("Post scheduled successfully:", response.data);
            }
          } else {
            const response = await axios.post(
              `${CONST.server}/api/schedule-facebook-post`,
              {
                pageAccessToken: accessToken,
                pageId: pageId,
                message: postText,
                scheduleTime: `${selectedDate}T${selectedTime}:00`,
              }
            );
            console.log("Post scheduled successfully:", response.data);
          }
        } catch (error) {
          console.error(
            "Error scheduling post:",
            error.response?.data || error.message
          );
        }
      } else if (selectedSite === "insta") {
        try {
          let pageId = "";
          let accessToken = "";
          const facebookPlatform = clientName.socialMedia.find(
            (entry) => entry.platform === "insta"
          );
          if (facebookPlatform) {
            pageId = facebookPlatform.id;
            accessToken = facebookPlatform.accessToken;
            // console.log("Facebook ID:", facebookId);
          } else {
            console.log("Insta platform not found in social media");
          }
          const response = await axios.post(
            `${CONST.server}/schedule-instagram-post`,
            {
              facebookUserAccessToken: accessToken,
              instagramAccountId: pageId,
              postCaption: postText,
              imageUrl: selectedImages[0],
              scheduleTime: `${selectedDate}T${selectedTime}:00`,
            }
          );

          console.log("Post scheduled successfully:", response.data);
        } catch (error) {
          console.error(
            "Error scheduling post:",
            error.response?.data || error.message
          );
        }
      } else if (selectedSite === "twitter") {
        try {
          let tokensecret = "";
          let accessToken = "";
          const facebookPlatform = clientName.socialMedia.find(
            (entry) => entry.platform === "twitter"
          );
          if (facebookPlatform) {
            tokensecret = facebookPlatform.id;
            accessToken = facebookPlatform.accessToken;
            // console.log("Facebook ID:", facebookId);
          } else {
            console.log("Twitter platform not found in social media");
          }
          const response = await axios.post(
            `${CONST.server}/schedule-twitter-post`,
            {
              accessToken: accessToken,
              accessSecretToken: tokensecret,
              status: postText,
              path: selectedImages[0],
              scheduleTime: `${selectedDate}T${selectedTime}:00`,
            }
          );

          console.log("Post scheduled successfully:", response.data);
        } catch (error) {
          console.error(
            "Error scheduling post:",
            error.response?.data || error.message
          );
        }
      } else if (selectedSite === "linkedin") {
        try {
          let pageId = "";
          let accessToken = "";
          const facebookPlatform = clientName.socialMedia.find(
            (entry) => entry.platform === "linkedin"
          );
          if (facebookPlatform) {
            pageId = facebookPlatform.id;
            accessToken = facebookPlatform.accessToken;
            // console.log("Facebook ID:", facebookId);
          } else {
            console.log("Linkedin platform not found in social media");
          }
          if (selectedImages.length > 0) {
            const selectedFileExtension = selectedImages[0]
              .split(".")
              .pop()
              .toLowerCase();
            if (selectedFileExtension === "mp4") {
              const response = await axios.post(
                `${CONST.server}/api/schedule-linkedin-video`,
                {
                  accessToken: accessToken,
                  linkedInId: pageId,
                  videoUrl: selectedImages[0],
                  postText: postText,
                  scheduleTime: `${selectedDate}T${selectedTime}:00`,
                }
              );
              console.log("Video post scheduled successfully:", response.data);
            } else {
              const response = await axios.post(
                `${CONST.server}/api/schedule-linkedin-image`,
                {
                  accessToken: accessToken,
                  linkedInId: pageId,
                  postText: postText,
                  imageUrl: selectedImages[0],
                  scheduleTime: `${selectedDate}T${selectedTime}:00`,
                }
              );
              console.log("Image post scheduled successfully:", response.data);
            }
          } else {
            const response = await axios.post(
              `${CONST.server}/api/schedule-linkedin-post`,
              {
                accessToken: accessToken,
                linkedInId: pageId,
                postText: postText,
                scheduleTime: `${selectedDate}T${selectedTime}:00`,
              }
            );
            console.log("Post scheduled successfully:", response.data);
          }
        } catch (error) {
          console.error(
            "Error scheduling post:",

            error.response?.data || error.message
          );
        }
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Create Post
          </Typography>
        </div>
        <h4>Select Client</h4>
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
        <h4>Write Post</h4>
        <TextField
          fullWidth
          label="Post Text"
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          margin="normal"
        />
        <h4>Choose Image/Video</h4>
        <div
          style={{
            border: "2px solid black",
            background: "rgb(242, 242, 242)",
            width: "300px",
            height: "180px",
            overflowX: "auto",
            borderRadius: "20px",
            textAlign: "center",
            backgroundColor: "rgb(242, 242, 242)",
          }}
        >
          {selectedImages.length > 0 ? (
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {selectedImages.map((mediaLink, index) => {
                  const isVideo = mediaLink.endsWith(".mp4");

                  return (
                    <div
                      key={index}
                      style={{
                        margin: "5px",
                        position: "relative",
                        backgroundColor: isVideo
                          ? "rgba(0, 0, 0, 0.3)"
                          : "transparent",
                        borderRadius: "20px",
                        padding: "2px",
                      }}
                    >
                      {isVideo ? (
                        <video
                          controls
                          width="150"
                          height="150"
                          style={{
                            borderRadius: "20px",
                          }}
                        >
                          <source src={mediaLink} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={mediaLink}
                          alt={`Selected Media ${index}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            padding: "20px",
                            borderRadius: "20px",
                          }}
                        />
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "black",
                        }}
                      >
                        &#10005; {/* Render a cross (X) character */}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>No media selected</div>
          )}
        </div>

        {/* <h4>Choose video</h4>
        <input type="file" accept="video/*" onChange={handleVideoChange} /> */}
        <h4>Choose Date and Time</h4>
        <TextField
          fullWidth
          label=""
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label=""
          type="time"
          value={selectedTime}
          onChange={(event) => setSelectedTime(event.target.value)}
          margin="normal"
        />
        <h4>Select Site</h4>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="site-select">
            {availablePlatforms.length === 0
              ? "Select Client First"
              : "Available Site"}
          </InputLabel>
          <Select
            value={selectedSite}
            onChange={(event) => {
              setSelectedSite(event.target.value);
            }}
            label="Site"
            inputProps={{
              name: "site",
              id: "site-select",
            }}
            disabled={availablePlatforms.length === 0}
          >
            {availablePlatforms.map((platform) => (
              <MenuItem key={platform} value={platform}>
                {platform.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            display: "flex",
            margin: "30px",
            justifyContent: "center",
          }}
        >
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <AddPost /> */}

        <ClientForm />

        <Box sx={{ display: "flex" }}>
          {/* <Sidebar/> */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
          >
            <Toolbar />
            <div
              style={{
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
              }}
            >
              <div
                className="dashboard"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.5)",
                }}
              ></div>

              <div style={{ height: "220px" }}></div>

              <div
                style={{
                  width: "100%",
                  height: "30px",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                  padding: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  transform: "translateY(-2px)",
                }}
              >
                <Box
                  sx={{
                    maxWidth: { xs: 320, sm: 480 },
                    bgcolor: "background.paper",
                  }}
                >
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons={true}
                    indicatorColor="#1877F2"
                  >
                    <Tab
                      sx={{
                        "&&.Mui-selected": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on selection
                        },
                        "&:hover": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on hover
                        },
                      }}
                      style={{ fontSize: "18px", fontWeight: "bold" }} // Added fontWeight: "bold" to make the font bold
                      label="Images"
                      value="images"
                    />
                    <Tab
                      sx={{
                        "&&.Mui-selected": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on selection
                        },
                        "&:hover": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on hover
                        },
                      }}
                      style={{ fontSize: "18px", fontWeight: "bold" }} // Added fontWeight: "bold" to make the font bold
                      label="Videos"
                      value="videos"
                    />
                    <Tab
                      sx={{
                        "&&.Mui-selected": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on selection
                        },
                        "&:hover": {
                          backgroundColor: "#C8F3FF",
                          color: "#0F74A7",
                          fontWeight: "bold", // Set the font weight to bold on hover
                        },
                      }}
                      style={{ fontSize: "18px", fontWeight: "bold" }} // Added fontWeight: "bold" to make the font bold
                      label="Users"
                      value="users"
                    />
                  </Tabs>
                </Box>
              </div>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxHeight: "60vh",
                  maxWidth: "100%",
                  overflowX: "hidden",
                  backgroundImage: `url(${bg})`,
                  overflowY: "auto",
                  ...scrollbarStyle,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "left",
                    alignItems: "center",
                    margin: "10px",
                    marginLeft: "0px",
                    width: "100%",
                    paddingLeft: "0px",
                  }}
                >
                  {mode === "images" &&
                    images.map((image, index) => (
                      <React.Fragment key={index}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "10px",
                            width: "100%",
                            height: "200px",
                            justifyContent: "left",
                            flexWrap: "nowrap",
                            gap: "10px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            transform: "translateY(-2px)",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: "400px",
                            }}
                          >
                            <img
                              src={
                                CONST.server +
                                "/public/" +
                                localStorage.getItem("uid") +
                                "/images/" +
                                image._id +
                                ".jpg"
                              }
                              alt="nf"
                              onError={(e) => {
                                e.currentTarget.src = img404;
                              }}
                              style={{
                                height: "100%",
                                borderRadius: "5px",
                                objectFit: "fill",
                                paddingLeft: "50px",
                              }}
                            />
                          </div>
                          <button
                            onClick={() => {
                              var url = Base64.encode(
                                localStorage.getItem("uid") +
                                  "/images/" +
                                  image._id +
                                  ".jpg"
                              );
                              document.location.href =
                                "/createGraphics/" + url + "/Design";
                            }}
                            style={{
                              marginTop: "5px",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              addToPost(image._id, "img");
                            }}
                            style={{
                              marginTop: "5px",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Add to Post
                          </button>
                        </div>
                      </React.Fragment>
                    ))}

                  {mode === "videos" &&
                    videos.map((video, index) => (
                      <React.Fragment key={index}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "10px",
                            width: "100%",
                            height: "200px",
                            justifyContent: "left",
                            flexWrap: "nowrap",
                            gap: "10px",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            borderRadius: "8px",
                            transform: "translateY(-2px)",
                          }}
                        >
                          <video
                            src={
                              CONST.server +
                              "/public/" +
                              localStorage.getItem("uid") +
                              "/videos/" +
                              video._id +
                              ".mp4"
                            }
                            controls
                            style={{
                              width: "400px",
                              height: "100%",
                              borderRadius: "5px",
                              objectFit: "cover",
                              paddingLeft: "50px",
                            }}
                          ></video>
                          <button
                            onClick={() => {
                              var url = Base64.encode(
                                localStorage.getItem("uid") +
                                  "/videos/" +
                                  video._id +
                                  ".mp4"
                              );
                              document.location.href =
                                "/createGraphics/" + url + "/Video";
                            }}
                            style={{
                              marginTop: "5px",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              addToPost(video._id, "vid");
                            }}
                            style={{
                              marginTop: "5px",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                          >
                            Add to Post
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            </div>
          </Box>
        </Box>
      </div>
    </React.Fragment>
  );
}

export default Contents;
