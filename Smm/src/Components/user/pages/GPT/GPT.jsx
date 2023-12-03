import React from "react";
import Sidebar from "../../layouts/Sidebar/Sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ClearIcon from "@mui/icons-material/Clear";

import { CONST } from "../../../../constants";

import TextField from "@mui/material/TextField";
import axios from "axios";

import hammer from "../../../../assets/hammer.webp";
import bg from "../../../../assets/dashboard.png";
import JoditEditor from "jodit-react";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import NativeSelect from "@mui/material/NativeSelect";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
const drawerWidth = 240;
var prompt = "";
var instruction = "";
function GPT() {
  const [side, setSide] = useState(true);
  const [WD, setWD] = useState("");
  const [keywords, setkeywords] = useState([]);
  const [providedText, setprovidedText] = useState("");
  const [count, setcount] = useState(100);
  const [isCreate, setIsCreate] = useState(true);
  const [type, settype] = useState("");
  const [content, setcontent] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [showEditor, setshowEditor] = useState(false);

  function GetResponse() {
    setshowEditor(true);
    prompt =
      "context: you are a social media content creator specialist at a company whose Business info is " +
      WD +
      "word limit is " +
      count +
      "the topic is " +
      providedText +
      " use tags " +
      "#" +
      keywords[0] +
      " #" +
      keywords[1] +
      " #" +
      keywords[2] +
      " #" +
      keywords[3] +
      " #" +
      keywords[4] +
      " and the type of content is a " +
      type;

    axios
      .post(CONST.server + "/gpt/createText", {
        prompt: prompt,
      })
      .then((response) => {
        setcontent(response.data.message);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function GetImproved() {
    setshowEditor(true);
    prompt = providedText;
    instruction =
      type +
      " use tags " +
      "#" +
      keywords[0] +
      " #" +
      keywords[1] +
      " #" +
      keywords[2] +
      " #" +
      keywords[3] +
      " #" +
      keywords[4] +
      " and the business type here is " +
      WD +
      " also the word count should be less than equal to " +
      count;

    axios
      .post(CONST.server + "/gpt/improveText", {
        prompt: prompt,
        instruction: instruction,
      })
      .then((response) => {
        setcontent(response.data.message);
        setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleInputChange = (event) => {
    setWD(event.target.value);
  };

  const [newKeyword, setNewKeyword] = useState("");

  // Function to handle keyword input change
  const handleKeywordChange = (event) => {
    setNewKeyword(event.target.value);
  };

  // Function to add a new keyword to the keywords array
  const addKeyword = () => {
    if (newKeyword.trim() !== "") {
      setkeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  // Function to handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      addKeyword();
    }
  };

  const removeKeyword = (indexToRemove) => {
    const updatedKeywords = keywords.filter(
      (_, index) => index !== indexToRemove
    );
    setkeywords(updatedKeywords);
  };

  useEffect(() => {
    try {
      axios
        .get(CONST.server + "/user/getDetails/" + localStorage.getItem("uid"))
        .then((response) => {
          console.log(response.data);

          // setWD(response.data.description ? response.data.description : "");

          // setKeywords(
          //   response.data.keywords && Array.isArray(response.data.keywords)
          //     ? response.data.keywords
          //     : []
          // );
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <React.Fragment>
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
          <div>
            <div style={{ position: "fixed", top: "0px", zIndex: 1001 }}>
              {isLoading ? (
                <img
                  src={hammer}
                  style={{ position: "fixed", top: "50vh", left: "50vw" }}
                  alt=""
                />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                position: "relative",

                padding: "5rem",

                overflow: "auto",
                overflowY: "scroll",
              }}
            >
              {isLoading ? null : (
                <div>
                  <div>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={15}
                        md={15}
                        lg={15}
                        style={{ flexWrap: "wrap", display: "flex" }}
                      >
                        <Stack direction="row" spacing={2}>
                          <Card
                            sx={{
                              width: "30vw",
                              height: "30vh",
                              overflow: "auto",
                              color: "black",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                              transform: "translateY(-2px)",
                            }}
                          >
                            <CardContent
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="h5">
                                Bussiness Info
                              </Typography>
                              <Typography
                                gutterBottom
                                variant="h7"
                                component="div"
                                style={{ flexWrap: "wrap", display: "flex" }}
                              >
                                <TextField
                                  // label="Enter Business Info..."
                                  variant="outlined"
                                  fullWidth
                                  multiline
                                  rows={4}
                                  value={WD}
                                  onChange={handleInputChange}
                                />
                              </Typography>
                            </CardContent>
                          </Card>

                          <Card
                            sx={{
                              width: "30vw",
                              height: "30vh",
                              overflow: "auto",
                              color: "black",
                              // background:
                              // "linear-gradient(to right bottom, #39406D, #151829)",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                              transform: "translateY(-2px)",
                            }}
                          >
                            <CardContent
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="h5">Keywords</Typography>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  flexDirection: "row",
                                  flexWrap: "wrap", // Allow keywords to wrap to the next line
                                  maxWidth: "100%",
                                  // flexWrap: "wrap", // Allow keywords to wrap to the next line
                                }}
                              >
                                <TextField
                                  variant="outlined"
                                  value={newKeyword}
                                  onChange={handleKeywordChange}
                                  onKeyDown={handleKeyPress}
                                  fullWidth
                                  multiline
                                  rows={4}
                                  InputProps={{
                                    endAdornment: keywords.map(
                                      (keyword, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            padding: "5px",
                                            flexWrap: "nowrap",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            margin: "2px",
                                            backgroundColor: "#f0f0f0",
                                            position: "relative",
                                          }}
                                        >
                                          <Typography variant="h6">
                                            <IconButton
                                              size="small"
                                              onClick={() =>
                                                removeKeyword(index)
                                              }
                                              style={{
                                                position: "absolute",
                                                top: "-10px",
                                                right: "-10px",
                                                fontSize: "5px",
                                              }}
                                            >
                                              <ClearIcon />
                                            </IconButton>
                                            {keyword}
                                          </Typography>
                                        </div>
                                      )
                                    ),
                                  }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </Stack>
                      </Grid>
                    </Grid>
                  </div>
                  <br />

                  <div
                    style={{
                      color: "black",
                      width: "100%",

                      backgroundColor: "transparent",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "left",
                      margin: "30px",
                      marginLeft: "0px",

                      overflowX: "auto",
                      overflowY: "hidden",
                      alignItems: "center",
                    }}
                  >
                    <strong style={{ fontSize: "18px" }}></strong>
                  </div>
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "left",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        width: "100%",
                      }}
                    >
                      {(() => {
                        switch (isCreate) {
                          case "improve":
                            return (
                              <Typography variant="h5">
                                Enter the Text to Improve
                              </Typography>
                            );
                          case "suggest":
                            return (
                              <Typography variant="h5">
                                Enter the Topic to Suggest
                              </Typography>
                            );
                          case "generate":
                            return (
                              <Typography variant="h5">
                                Enter the Topic to Generate
                              </Typography>
                            );
                          default:
                            return (
                              <Typography variant="h5">
                                Enter the Topic
                              </Typography>
                            );
                        }
                      })()}
                    </div>

                    <TextField
                      id="outlined-multiline-flexible"
                      label="Topic"
                      multiline
                      maxRows={isCreate ? 6 : 10}
                      onChange={(e) => {
                        setprovidedText(e.target.value);
                      }}
                      style={{ background: "whitesmoke", width: "60vw" }}
                    />
                  </div>
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "left",
                      display: "flex",
                      margin: "20px",
                      marginLeft: "0px",
                    }}
                  >
                    <Typography variant="h5">
                      Enter the Word Count Limit :
                    </Typography>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      justifyContent: "left",
                      display: "flex",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="number"
                      style={{ width: "20%", backgroundColor: "white" }}
                      value={count}
                      onChange={(e) => {
                        setcount(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <br />
                    <Stack direction="column" spacing={3}>
                      {(() => {
                        switch (isCreate) {
                          case "improve":
                            return (
                              <Typography variant="h5">
                                Enter the Text to Improve
                              </Typography>
                            );
                          case "suggest":
                            return null;
                          case "generate":
                            return (
                              <Typography variant="h5">
                                Enter the type of Content(Blog/Twee)
                              </Typography>
                            );
                          default:
                            return (
                              <Typography variant="h5">
                                Enter the Topic
                              </Typography>
                            );
                        }
                      })()}

                      {!(isCreate === "suggest") && (
                        <TextField
                          id="outlined-basic"
                          label="Outlined"
                          variant="outlined"
                          type="text"
                          style={{ width: "100%", backgroundColor: "white" }}
                          value={type}
                          onChange={(e) => {
                            settype(e.target.value);
                          }}
                        />
                      )}
                    </Stack>
                  </div>

                  <br />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <Box sx={{ width: "30" }}>
                      <FormControl style={{ width: "200px" }}>
                        <InputLabel
                          variant="standard"
                          htmlFor="uncontrolled-native"
                        >
                          Mode
                        </InputLabel>
                        <NativeSelect
                          onChange={(e) => {
                            setIsCreate(e.target.value);
                            // console.log(e.target.value === "true");
                          }}
                          inputProps={{
                            name: "age",
                            id: "uncontrolled-native",
                          }}
                        >
                          <option value="generate">Generate</option>
                          <option value="suggest">Suggest</option>
                          <option value="improve">Improve</option>
                        </NativeSelect>
                      </FormControl>
                    </Box>

                    <Button
                      style={{ width: "100px" }}
                      onClick={() => {
                        setisLoading(true);
                        if (isCreate === "generate" || isCreate === "suggest") {
                          GetResponse();
                        } else {
                          GetImproved();
                        }
                      }}
                      variant="contained"
                      color="success"
                    >
                      Go
                    </Button>
                  </div>
                  <br />
                  <div
                    style={{
                      width: "60vw",
                      maxHeight: "30vh",
                      overflowY: "auto",
                      marginBottom: "200px",
                    }}
                  >
                    {showEditor ? (
                      <JoditEditor
                        value={content}
                        config={{ readonly: false, statusbar: "true" }} // set to false to make the editor editable
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setcontent(newContent)} // preferred to use only this option to update the content for performance reasons
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default GPT;
