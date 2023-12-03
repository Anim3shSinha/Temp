import React from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Navbar from "../../layouts/Navbar/Navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import bg from "../../../../assets/dashboard.png";
import Component from "./CreativeEditorSDK";
import axios from "axios";
import { CONST } from "../../../../constants";
import { useParams } from "react-router-dom";
import { Base64 } from "js-base64";
import { useState } from "react";
import { Select, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
const drawerWidth = 240;

function MediaEditor() {

  const [side, setside] = useState(true);
  const [value, setvalue] = useState(0);
  const [initImage, setinitImage] = useState("");
  const [show, setshow] = useState(true);
  const [mode, setMode] = useState("Design");
  const { url, mod } = useParams();
  
  var BaseUrl = url ? Base64.decode(url) : null;
  console.log("mod", mod);
  const config = {
    role: "Creator",
    // theme: "dark",
    ...(BaseUrl ? { initialImageURL: CONST.server + "/" + BaseUrl } : {}),

    initialSceneMode: mod ? mod : mode,

    // license: process.env.REACT_APP_LICENSE,
    ui: {
      elements: {
        view: "advanced",
        panels: {
          inspector: {
            show: true,
            position: "right",
          },
          settings: true,
        },
        dock: {
          iconSize: "normal",
          hideLabels: true,
        },
        navigation: {
          action: {
            save: true,
            load: true,
            back: true,
            close: true,

            export: {
              show: true,
              save: true,
              load: true,

              format: ["image/png", "video/mp4"],
            },
          },
        },
      },
    },
    callbacks: {
      onExport: (blobs, options) => {
        window.alert("Export callback!");

        console.log("exporting...");

        console.log(blobs);
        let formData = new FormData();
        formData.append("blob", blobs[0]);

        axios
          .post(
            CONST.server + `/store/images/${localStorage.getItem("uid")}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          });

        return Promise.resolve();
      },
      onBack: () => {
        window.location.href = "/dashboard";
        return Promise.resolve();
      },
      onClose: () => {
        setshow(false);
      },
      onUnsupportedBrowser: () => {
        /* This is the default window alert which will be shown in case an unsupported
         * browser tries to run CE.SDK */
        window.alert(
          "Your current browser is not supported.\nPlease use one of the following:\n\n- Mozilla Firefox 86 or newer\n- Apple Safari 14.1 or newer\n- Microsoft Edge 88 or newer\n- Google Chrome 88 or newer"
        );
      },
      onSave: (scene) => {
        console.info(scene);

        // Convert the scene object to a JSON string
        const sceneJson = JSON.stringify(scene);

        // Create a blob from the JSON string
        const blob = new Blob([sceneJson], { type: "application/json" });

        // Create a link for the blob
        const url = URL.createObjectURL(blob);

        // Create an anchor element
        const a = document.createElement("a");

        // Set the href attribute of the anchor element to the blob URL
        a.href = url;

        // Set the download attribute of the anchor element to specify the filename
        a.download = "scene.json";

        // Append the anchor element to the document
        document.body.appendChild(a);

        // Programmatically click the anchor element to trigger the download
        a.click();

        // Remove the anchor element from the document
        document.body.removeChild(a);

        // Release the blob URL
        URL.revokeObjectURL(url);

        return Promise.resolve(scene);
      },
      onUpload: (file, onProgress) => {
        window.alert("Upload callback!");
        console.log("uploaded file ", file.type.split("/")[0]);
        let formData = new FormData();
        formData.append("blob", file);

        return axios
          .post(
            CONST.server + `/store/images/${localStorage.getItem("uid")}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            console.log(response);
            console.log(
              CONST.server +
                "/public/" +
                localStorage.getItem("uid") +
                "/" +
                `${response.data.uid}`
            );
            console.log(
              "upload url",
              CONST.server +
                "/public/" +
                localStorage.getItem("uid") +
                "/" +
                "images/" +
                `${response.data.uid}` +
                ".jpg"
            );
            var newImage;

            if (file.type.split("/")[0] == "image") {
              newImage = {
                id: response.data.uid,
                crossOrigin: "*",
                meta: {
                  uri:
                    CONST.server +
                    "/public/" +
                    localStorage.getItem("uid") +
                    "/" +
                    "images/" +
                    `${response.data.uid}` +
                    ".jpg",
                  thumbUri:
                    CONST.server +
                    "/public/" +
                    localStorage.getItem("uid") +
                    "/" +
                    "images/" +
                    `${response.data.uid}` +
                    ".jpg",
                },
              };
            } else {
              newImage = {
                id: response.data.uid,
                crossOrigin: "*",
                meta: {
                  uri:
                    CONST.server +
                    "/public/" +
                    localStorage.getItem("uid") +
                    "/" +
                    "videos/" +
                    `${response.data.uid}` +
                    ".mp4",
                  thumbUri:
                    CONST.server +
                    "/public/" +
                    localStorage.getItem("uid") +
                    "/" +
                    "videos/" +
                    `${response.data.uid}` +
                    ".mp4",
                },
              };
            }

            return Promise.resolve(newImage);
          })
          .catch((err) => {
            console.log(err);
            // Handle error, potentially return a default value or reject the promise
            return Promise.reject(err);
          });
      },
      log: (message, logLevel) => {
        switch (logLevel) {
          case "Info":
            console.info(message);
            break;
          case "Warning":
            console.warn(message);
            break;
          case "Error":
            console.error(message);
            break;
          default:
            console.log(message);
        }
      },

      onLoad: () => {
        return new Promise((resolve, reject) => {
          // Create an input element for file selection
          const input = document.createElement("input");
          input.type = "file";

          // Listen for the change event to know when a file has been selected
          input.addEventListener("change", () => {
            const file = input.files[0];
            if (!file) {
              reject("No file selected");
              return;
            }

            // Create a new FileReader to read the content of the file
            const reader = new FileReader();

            // Callback when the file is read
            reader.onload = () => {
              try {
                // Parse the file content as JSON
                const scene = JSON.parse(reader.result);
                window.alert("Load callback!");
                resolve(scene);
              } catch (error) {
                reject("Error parsing the file");
              }
            };

            // Read the file as text
            reader.readAsText(file);
          });

          // Programmatically open the file picker dialog
          input.click();
        });
      },
    },
    // Begin standard template presets
    presets: {},
    // End standard template presets
  };

  function toggleSideMenu() {
    setside(!side);
    return side;
  }
  function showLoad() {
    setshow(false);
    setTimeout(() => {
      setshow(true);
    }, 500);
  }
  return (
    <React.Fragment>
      {/* <Navbar /> */}
      <Box sx={{ display: "flex" }}>
        {/* <Sidebar /> */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            // width: { sm: `calc(100% - ${drawerWidth}px)` },
            width:"100%"
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
            <div style={{ position: "fixed", top: "0px", zIndex: 1000 }}></div>
            <div></div>
            <div id="here">
              {!show ? (
                <input
                  type="text"
                  onChange={(e) => {
                    setinitImage(e.target.value);
                    showLoad();
                  }}
                />
              ) : null}
            </div>

            {!show ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ height: "200px" }}>
                  <Card
                    sx={{
                      width: "30vw",
                      height: "20vh",
                      overflow: "auto",
                      color: "white",
                      background:
                        "linear-gradient(to right bottom, #39406D, #151829)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2}>
                        <Typography variant="h6">Mode</Typography>
                      </Stack>

                      <Select
                        name="mode"
                        id="mode"
                        value={mode}
                        label="age"
                        style={{
                          maxHeight: "50px",
                          width: "200px",
                          color: "white",
                        }}
                        onChange={(e) => {
                          setMode(e.target.value);
                          showLoad();
                        }}
                      >
                        <MenuItem value="Design">Design Photo</MenuItem>
                        <MenuItem value="Video">Edit Video</MenuItem>
                      </Select>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
            <div
              className="dashboard"
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                background: "rgba(255,255,255,0.5)",
              }}
            ></div>
            <div style={{ top: "200px" }}>
              {show ? <Component config={config} /> : null}
            </div>
          </div>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default MediaEditor;
