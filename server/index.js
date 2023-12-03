// const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const cors = require("cors");
// const axios = require("axios");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const crypto = require("crypto");
const session = require("express-session");
const { google } = require("googleapis");
const secretKey = crypto.randomBytes(32).toString("hex");
// const app = express();
// const port = 5000;

const { Task, Manager } = require("./models/SuperAdmin");
const { Client } = require("./models/Client");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const https = require("https");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "*" }));
const port = 8080;
const dbConfig = require("./config");
const { ObjectId } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const { OAuth2Client, UserRefreshClient } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(
  "753124195649-0v404kl4hekpr1isc16u05c2ai4n02ps.apps.googleusercontent.com",
  "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",
  "postmessage"
);

//////////////GPT CONFIG///////////////////

const { Configuration, OpenAIApi } = require("openai");
const { log } = require("console");
const { default: axios } = require("axios");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

/////////////GPT CONFIG///////////////////
let db;
dbConfig
  .connect()
  .then((database) => {
    db = database;
    console.log("Database connection established");

    db.collection("users")
      .createIndex({ email: 1 }, { unique: true })
      .then(() => {
        console.log("Created unique index on email field");
      })
      .catch((err) => {
        console.log("Error creating unique index:", err);
      });
  })
  .catch((err) => {
    console.log("Error establishing database connection:", err);
  });
/////////////////////////////////////////////////////STATIC FILE SERVE/////////////////////////////////////////////////////////
app.use(express.static("public"));
app.get("/:file", (req, res) => {
  const file = req.params.file; // Use dot notation to access the file parameter
  console.log(file);
  res.sendFile(path.resolve(__dirname, "public"));
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400).send("Missing parameters");
    return;
  }

  // hash password before storing it
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const result = await db.collection("users").insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      approved: false,
      manager: "",
    });

    res.send(result);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return res.status(400).send("Email already exists");
    }

    res.status(500).send(err);
  }
});

app.post("/login", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send("Missing parameters");
    return;
  }

  try {
    const user = await db
      .collection("users")
      .findOne({ email: email, approved: true });

    var isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager,
      });
    } else {
      res.status(500).json({ err: "No Such User" });
    }
  } catch (err) {
    res.status(400).send("Invalid Login Details");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post("/user/setDetails", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const {
    id,
    username,
    phoneNumber,
    email,
    address,
    CS,
    kw1,
    kw2,
    kw3,
    kw4,
    kw5,
    Zc,
    Website,
    WD,
  } = req.body;

  try {
    const updatedUser = await db.collection("users").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: username,
          email: email,
          phone: phoneNumber,
          address: address,
          country_state: CS,
          keywords: [kw1, kw2, kw3, kw4, kw5],
          zipcode: Zc,
          website: Website,
          description: WD,
        },
      },
      { returnOriginal: false } // To return updated document
    );

    if (!updatedUser.value) {
      return res.status(404).send({ message: "User not found" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/user/getDetails/:id", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const { id } = req.params;

  try {
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/user/getAllUsers", async (req, res) => {
  try {
    const users = await db
      .collection("users")
      .find(
        { role: "user", approved: true },
        { projection: { _id: 1, name: 1, role: 1, email: 1 } }
      )
      .toArray();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

/////////////////////////////////////////////////////GPT/////////////////////////////////////////////////////////////////////

app.post("/gpt/createText", async (req, res) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: req.body.prompt },
      ],
    });

    console.log(completion.data.choices[0].message.content);

    res.status(200).json({
      message: completion.data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error occurred while generating text from GPT-4." });
  }
});

app.post("/gpt/createImage", (req, res) => {
  const { prompt } = req.body;

  async function imageGen() {
    const response = await openai.createImage({
      prompt: prompt,
      n: 2,
      size: "1024x1024",
    });

    res.status(200).json({
      images: response.data,
    });
  }
  imageGen();
});

app.post("/gpt/improveText", async (req, res) => {
  const { prompt, instruction } = req.body;

  // Check for missing input or instruction in the request body
  if (!prompt || !instruction) {
    return res.status(400).json({
      error: "Missing required fields: prompt and/or instruction.",
    });
  }

  try {
    const response = await openai.createEdit({
      model: "text-davinci-edit-001",
      input: prompt,
      instruction: instruction,
    });

    // Check if the response contains the expected data
    if (
      !response ||
      !response.data ||
      !response.data.choices ||
      !response.data.choices[0] ||
      !response.data.choices[0].text
    ) {
      return res.status(500).json({
        error: "Unexpected response from the OpenAI API.",
      });
    }

    console.log(response.data.choices[0].text);

    res.status(200).json({
      message: response.data.choices[0].text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});

////////////////////////////////////////////////////////////////GPT//////////////////////////////////////////////////////////

//<---------------------------------------------------ADMIN SECTION----------------------------------------------------------------------------->

app.post("/admin/login", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Missing parameters");
    return;
  }

  const user = await db.collection("admin").findOne({ username: username });

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    res.status(200).json({
      id: user._id,
      name: user.username,
      email: "superadmin",
      role: "superadmin",
    });
  } else {
    res.status(500).json({ err: "No Such User" });
  }
});

app.post("/admin/ToApprove", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const users = await db
    .collection("users")
    .find({ approved: false })
    .toArray();

  res.status(200).json({
    users: users,
  });
});
app.post("/admin/approve", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const id = req.body.id;

  try {
    if (!id) {
      res
        .status(400)
        .json({ error: "Invalid request. Missing 'id' parameter." });
      return;
    }
    console.log("here", id);

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { approved: true } });
    console.log(result);

    if (!result && !result.acknowledged) {
      res.status(404).json({ error: "Document not found or not modified." });
      return;
    }

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
});

app.post("/admin/managers", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  try {
    const result = await db
      .collection("users")
      .find({ role: "manager", approved: true })
      .toArray();

    if (result.length === 0) {
      res.status(404).json({ error: "No managers found." });
      return;
    }

    res.status(200).json({ manager: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/admin/managerlessUsers", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  try {
    const result = await db
      .collection("users")
      .find({ role: "user", approved: true, manager: "" })
      .toArray();

    if (result.length === 0) {
      res.status(404).json({ error: "No managers found." });
      return;
    }

    res.status(200).json({ users: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/admin/assign", async (req, res) => {
  const { uid, mid } = req.body;
  if (!uid || !mid) {
    res.status(400).json({ error: "Missing uid or mid in the request body" });
    return;
  }

  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  try {
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(uid) }, { $set: { manager: mid } });

    if (!result.acknowledged) {
      res.status(404).json({ error: "User not found or not modified." });
      return;
    }

    res.status(200).json({ message: "Manager assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//////////////////////////////////////////////////////////Image and video Section ////////////////////////////////////////////////////

app.post("/store/images/:id", upload.single("blob"), async (req, res) => {
  const { id } = req.params;

  // Check if file is provided
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }

  console.log(req.file.mimetype);
  const isVideo = req.file.mimetype.startsWith("video");

  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  const cid = uuidv4();
  var dir;
  if (isVideo) {
    dir = path.join(__dirname, "public", id, "videos");
  } else {
    dir = path.join(__dirname, "public", id, "images");
  }
  const dirPrev = path.join(__dirname, "uploads");

  // Create directory if it does not exist
  try {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`${dir} directory created/already exists`);
  } catch (e) {
    console.error(`Error creating directory: ${e}`);
    return res.status(500).send({ error: "Error creating directory." });
  }
  var newFilePath;
  const filePath = path.join(dirPrev, req.file.filename);
  if (isVideo) {
    newFilePath = path.join(dir, `${cid}.mp4`);
  } else {
    newFilePath = path.join(dir, `${cid}.jpg`);
  }

  // Get current date and time
  const currentDate = new Date();

  // Insert into the appropriate collection in the database
  if (isVideo) {
    await db
      .collection("videos")
      .insertOne({ _id: cid, uid: id, date: currentDate });
  } else {
    await db
      .collection("images")
      .insertOne({ _id: cid, uid: id, date: currentDate });
  }

  // Rename the file
  fs.rename(filePath, newFilePath, function (err) {
    if (err) {
      console.error("Error writing file:", err);
      return res.sendStatus(500);
    } else {
      console.log("File saved successfully");
      return res.send({ uid: cid }); // Moved the response here
    }
  });
});

app.get("/store/images/get/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!db) {
      res.status(500).send("Database not connected");
      return;
    }

    const images = await db.collection("images").find({ uid: id }).toArray();

    res.json({ images: images }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching images");
  }
});

app.get("/store/videos/get/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!db) {
      res.status(500).send("Database not connected");
      return;
    }

    const videos = await db.collection("videos").find({ uid: id }).toArray();

    res.json({ videos: videos }).status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching images");
  }
});
///////////////////////////////////////////////////////////////////GDRIVE///////////////////////////////////////////////////////////////////////
app.post("/auth/google", async (req, res) => {
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

  res.json(tokens);
});

app.post("/auth/google/refresh-token", async (req, res) => {
  console.log(req.body);

  try {
    const user = await new UserRefreshClient(
      req.body.clientId,
      req.body.clientSecret,
      req.body.refreshToken
    );
    const { credentials } = await user.refreshAccessToken();
    console.log(credentials);
    res.json(credentials);
  } catch (error) {
    console.log("err", error);
    res.sendStatus(500);
  }
});

app.post("/token/google/set/:id", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const id = req.params.id;
  const accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  if (accessToken && refreshToken) {
    const collection = db.collection("tokens");

    const existingEntry = await collection.findOne({ id });

    if (existingEntry) {
      await collection.updateOne(
        { id },
        {
          $set: {
            gAccessToken: accessToken,
            gRefreshToken: refreshToken,
          },
        }
      );
    } else {
      await collection.insertOne({
        id,
        gAccessToken: accessToken,
        gRefreshToken: refreshToken,
      });
    }

    res.sendStatus(200);
  } else {
    res.status(400).send("Invalid access token or refresh token");
  }
});
app.get("/token/google/get/:id", async (req, res) => {
  if (!db) {
    res.status(500).send("Database not connected");
    return;
  }

  const id = req.params.id;
  const collection = db.collection("tokens");

  const tokenEntry = await collection.findOne({ id });

  if (tokenEntry) {
    const { gAccessToken, gRefreshToken } = tokenEntry;
    res.json({ gAccessToken, gRefreshToken });
  } else {
    res.status(404).send("Token entry not found");
  }
});

////////////////////////////////////////////////////Super Admin/////////////////////////////////////////////////////////////////////

app.post("/add_task", async (req, res) => {
  const {
    site,
    description,
    client,
    clientId,
    lastModified,
    dueDate,
    postNumber,
    addInfo,
  } = req.body;

  // console.log(req.body);

  const newTask = {
    site,
    description,
    client,
    clientId,
    lastModified,
    dueDate,
    isCompleted: "Pending",
    postNumber,
    addInfo,
  };

  // Insert the new task document into the "tasks" collection
  const result = await db.collection("tasks").insertOne(newTask);
  console.log(clientId, "animesh");
  await db
    .collection("clients")
    .updateOne(
      { _id: new ObjectId(clientId) },
      { $push: { tasks: result.insertedId } }
    );
  if (result) {
    res.status(200);
  } else {
    res.status(500);
  }
});

////////////////////////////////////////////Get tasks/////////////////////////////////////

app.get("/get_tasks", async (req, res) => {
  const tasks = await db.collection("tasks").find().toArray();
  if (tasks) {
    res.json(tasks);
  } else {
    res.status(500);
  }
});

/////////////////////////////get client task ////////////////////////////////////////////

app.post("/get_tasks_by_client", async (req, res) => {
  try {
    const { clientId } = req.body; // Extract managerId from the request body
    // const manager = await db.collection("managers").findOne({_id:new ObjectId(managerId)}).populate("tasks");
    const manager = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(clientId) });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    const taskIds = manager.tasks.map((taskId) => new ObjectId(taskId));
    const tasks = await db
      .collection("tasks")
      .find({ _id: { $in: taskIds } })
      .toArray();
    // const tasks = manager.tasks;
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////// get manager task ////////////////////////////////////////////

app.post("/get_tasks_by_manager", async (req, res) => {
  try {
    const { managerId } = req.body; // Extract managerId from the request body
    // const manager = await db.collection("managers").findOne({_id:new ObjectId(managerId)}).populate("tasks");
    const manager = await db
      .collection("managers")
      .findOne({ _id: new ObjectId(managerId) });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    const taskIds = manager.tasks.map((taskId) => new ObjectId(taskId));
    const tasks = await db
      .collection("tasks")
      .find({ _id: { $in: taskIds } })
      .toArray();
    // const tasks = manager.tasks;
    res.json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////////Update Task///////////////////////////////////////

app.put("/update_tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // const task = await Task.findById(taskId);
    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.client = req.body.client || task.client;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.isCompleted = req.body.isCompleted || task.isCompleted;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.lastModified = new Date();
    const result = await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: task });
    if (result.modifiedCount === 1) {
      res.json(task);
    } else {
      res.status(500).json({ error: "Failed to update task." });
    }
  } catch (error) {
    console.error("Error updating task last modified date:", error);
    res.status(500).json({ error: "Failed to update task." });
  }
});

//////////////////////////////// get events for schduler ///////////////////////////////////

app.post("/get_events", async (req, res) => {
  try {
    let tasks;
    const { userId, userType } = req.body;

    if (userType === "Admin") {
      tasks = await db.collection("tasks").find().toArray();
    } else if (userType === "Manager") {
      const manager = await db
        .collection("managers")
        .findOne({ _id: new ObjectId(userId) });

      if (!manager) {
        return res.status(404).json({ error: "Manager not found" });
      }

      const taskIds = manager.tasks.map((taskId) => new ObjectId(taskId));
      tasks = await db
        .collection("tasks")
        .find({ _id: { $in: taskIds } })
        .toArray();
    } else if (userType === "Client") {
      const manager = await db
        .collection("clients")
        .findOne({ _id: new ObjectId(userId) });

      if (!manager) {
        return res.status(404).json({ error: "Client not found" });
      }

      const taskIds = manager.tasks.map((taskId) => new ObjectId(taskId));
      tasks = await db
        .collection("tasks")
        .find({ _id: { $in: taskIds } })
        .toArray();
    }

    const events = tasks.map((task) => {
      const dueDate = new Date(task.dueDate);
      const currentYear = dueDate.getFullYear();
      const currentMonth = dueDate.getMonth();
      const currentDate = dueDate.getDate();
      const dateStart = new Date(
        currentYear,
        currentMonth,
        currentDate + 2,
        12,
        30
      );

      return {
        label: task.client + " : " + task.site.toUpperCase(),
        dateStart: dateStart,
        dateEnd: dateStart,
        allDay: true,
        backgroundColor: task.isCompleted === "Pending" ? "#FF0000" : "#008000", // Adjust as needed
      };
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching manager's tasks:", error);
    res.status(500).json({ error: "Error fetching manager's tasks" });
  }
});

////////////////////////////////////////add manager/////////////////////////////////////////

app.post("/add_manager", async (req, res) => {
  const { id, name } = req.body;

  const newManager = {
    id,
    name,
  };

  const result = await db.collection("managers").insertOne(newManager);

  if (result) {
    res.status(200);
  } else {
    res.status(500);
  }
});

/////////////////////////////////////get manager///////////////////////////////////////

app.get("/get_managers", (req, res) => {
  db.collection("managers")
    .find()
    .toArray()
    .then((managers) => {
      res.json(managers);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch managers." });
    });
});

///////////////////////////////get manager by email/////////////////////////////////////

app.post("/get_manager_by_email", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email parameter is required." });
  }

  db.collection("managers")
    .findOne({ email: email })
    .then((manager) => {
      if (manager) {
        res.json({ managerId: manager._id });
      } else {
        res.status(404).json({ error: "Manager not found." });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Failed to fetch manager by email." });
    });
});

/////////////////////////////////get manager by id//////////////////////////////////////

app.post("/get_manager_id/", async (req, res) => {
  try {
    const managerId = req.body.id;
    const manager = await db
      .collection("managers")
      .findOne({ _id: new ObjectId(managerId) });

    if (manager) {
      res.json(manager);
    } else {
      res.status(404).json({ error: "Manager not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internalllll server error" });
  }
});

////////////////////////////assign task to manager////////////////////////////////////
app.post("/assign_task", async (req, res) => {
  try {
    const { taskId, managerId } = req.body;

    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const manager = await db
      .collection("managers")
      .findOne({ _id: new ObjectId(managerId) });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found." });
    }

    if (!task.assignedTo) {
      task.assignedTo = {
        id: manager._id,
        name: manager.name,
      };
      task.isCompleted = "In Progress";
    } else {
      task.assignedTo.id = manager._id;
      task.assignedTo.name = manager.name;
      isCompleted = "In Progress";
    }
    // manager.tasks.push(task._id);

    await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: task });

    // Push the task _id into the manager's tasks array
    await db
      .collection("managers")
      .updateOne(
        { _id: new ObjectId(managerId) },
        { $push: { tasks: new ObjectId(taskId) } }
      );

    res.json({ message: "Task assigned successfully." });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Failed to assign task." });
  }
});

//////////////////////////////////////////////////USER//////////////////////////////////////////

/////////////////////////////////////////add client///////////////////////////////////////////////
app.post("/add_client", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingClient = await db
      .collection("clients")
      .findOne({ email: email });

    if (existingClient) {
      return res.json({ clientId: existingClient._id });
    } else {
      const newClient = new Client({
        name,
        email,
        socialMedia: [],
        tasks: [],
      });

      const result = await db.collection("clients").insertOne(newClient);
      res.json({ clientId: result._id });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////get all client/////////////////////////////////////////////////////

app.get("/get_clients", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

////////////////////////////////get client by Id/////////////////////////////////////////////////////

app.get("/get_client/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const client = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(clientId) });
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////// Get client by manager id ///////////////////////////////////////////

app.post("/clients-for-manager", async (req, res) => {
  try {
    const { userId } = req.body;
    // Find the manager by _id using MongoDB's ObjectId
    const manager = await db
      .collection("managers")
      .findOne({ _id: new ObjectId(userId) });

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const taskIds = manager.tasks.map((taskId) => new ObjectId(taskId));

    const tasks = await db
      .collection("tasks")
      .find({ _id: { $in: taskIds } })
      .toArray();

    const clientIds = tasks
      .filter((task) => task.clientId !== undefined)
      .map((task) => task.clientId);
    // console.log("1", clientIds);
    const query = {
      _id: {
        $in: clientIds.map((clientId) => new ObjectId(clientId)),
      },
    };
    const clients = await db.collection("clients").find(query).toArray();
    // console.log("!", clients);
    res.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Error fetching clients" });
  }
});

/////////////////////////////////////////////Facebook api's////////////////////////////////////////////

const FACEBOOK_APP_ID = "959234698469542";
const FACEBOOK_APP_SECRET = "f7586846bdea68a989725c41901b307f";

const getFacebookPages = async (userAccessToken) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

app.post("/api/facebook/page-access-token", async (req, res) => {
  const { userAccessToken, userId } = req.body;
  const pageId = "109798618876119";
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${userAccessToken}`
    );

    // const facebookPages = await getFacebookPages(userAccessToken);
    const longLivedUserToken = response.data.access_token;

    const pageResponse = await axios.get(
      // `https://graph.facebook.com/${firstPageId}?fields=access_token&access_token=${longLivedUserToken}`
      `https://graph.facebook.com/${pageId}?fields=access_token&access_token=${longLivedUserToken}`
    );

    let pageAccessToken = pageResponse.data.access_token;
    const client = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(userId) });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // let pageAccessToken = "";
    // let pageId = "";

    // if (facebookPages.length > 0) {
    //   pageId = facebookPages[0].id;
    // }

    try {
      let facebookEntryIndex = -1;
      for (let i = 0; i < client.socialMedia.length; i++) {
        if (client.socialMedia[i].platform === "facebook") {
          facebookEntryIndex = i;
          break;
        }
      }

      if (facebookEntryIndex === -1) {
        const newfacebookEntry = {
          platform: "facebook",
          id: pageId,
          accessToken: pageAccessToken,
        };
        client.socialMedia.push(newfacebookEntry);
      } else {
        client.socialMedia[facebookEntryIndex].id = pageId;
        client.socialMedia[facebookEntryIndex].accessToken = pageAccessToken;
      }
      await db
        .collection("clients")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { socialMedia: client.socialMedia } }
        );
      console.log("Updated Client:", client);
    } catch (error) {
      console.error("Error:", error);
    }

    res.json({ pageAccessToken });
  } catch (error) {
    console.error("Error getting page access token:", error.response);
    res.status(500).json({ error: "Error getting page access token" });
  }
});

// app.post("/api/facebook/post-to-page", async (req, res) => {
//   const { pageAccessToken, message } = req.body;

//   try {
//     const response = await axios.post(
//       `https://graph.facebook.com/${PAGE_ID}/feed`,
//       {
//         message,
//         access_token: pageAccessToken,
//       }
//     );

//     res.json({ success: true, postId: response.data.id });
//   } catch (error) {
//     console.error("Error posting to page:", error.response.data);
//     res.status(500).json({ success: false, error: "Error posting to page" });
//   }
// });

const postToFBPage = async (pageId, pageAccessToken, message) => {
  const pageId1 = "109798618876119";
  console.log("asdfasdf");
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${pageId1}/feed`,
      {
        message,
        access_token: pageAccessToken,
      }
    );

    console.log("Scheduled post success:", response.data.id);
  } catch (error) {
    console.error("Error posting to page:", error.response.data);
  }
};

// app.post("/facebook-upload-photo", async (req, res) => {
//   try {
//     const photoUrl = req.body.url;
//     const accessToken = req.body.pageAccessToken;

//     const apiUrl = `https://graph.facebook.com/${PAGE_ID}/photos`;
//     const params = new URLSearchParams({
//       url: photoUrl,
//       access_token: accessToken,
//     });

//     const response = await axios.post(`${apiUrl}?${params.toString()}`);

//     res.status(response.status).json(response.data);
//   } catch (error) {
//     res.status(error.response.status).json(error.response.data);
//   }
// });

async function uploadPhotoToFacebook(pageId, photoUrl, pageAccessToken) {
  console.log(photoUrl);

  try {
    const apiUrl = `https://graph.facebook.com/${pageId}/photos?url=${encodeURIComponent(
      "https://one.digtl.biz:8443/public/6474454213bf03a335519e2f/images/522434e2-5916-4d07-a515-5b2cfd9464a0.jpg"
    )}&access_token=${pageAccessToken}`;
    const response = await axios.post(apiUrl);

    // const apiUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;

    // const postData = {
    //   url: photoUrl,
    // };

    // axios
    //   .post(apiUrl, postData, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     params: {
    //       access_token: pageAccessToken,
    //     },
    //   })
    //   .then((response) => {
    //     console.log("Photo posted successfully:", response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error posting photo:", error.response.data);
    //   });
    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
}

const fbUpload = require("facebook-api-video-upload");
async function uploadVideoToFacebook(
  pageId,
  photoUrl,
  pageAccessToken,
  message
) {
  const response = await axios.get(photoUrl, { responseType: "stream" });
  if (response.status === 200) {
    const writer = fs.createWriteStream(__dirname + "/video/Facebook.mp4", {
      flags: "w",
    });
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
      response.data.pipe(writer);
    });
  }
  const args = {
    token: pageAccessToken,
    id: pageId,
    stream: fs.createReadStream(__dirname + "/video/Facebook.mp4"),
    title: "",
    description: message,
  };

  fbUpload(args)
    .then((res) => {
      console.log("res: ", res);
      // return { success: true };
    })
    .catch((e) => {
      console.error(e);
      // return { success: false };
    });
}

////////////////////////////////////////////Linedin api's////////////////////////////////////////////////

const CLIENTID = "77oehyso38735v";
const CLIENTSECRET = "mKfYB9f0bE7tq4uc";
const REDIRECTURI = "http://localhost:3000/Accounts"; //give desired path

app.get("/api/linkedin/login", (req, res) => {
  const loginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENTID}&redirect_uri=${REDIRECTURI}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.json({ redirectUrl: loginUrl });
});

app.get("/api/linkedin/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const userId = req.query.userId;

    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECTURI,
          client_id: CLIENTID,
          client_secret: CLIENTSECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    try {
      const profileResponse = await axios.get(
        "https://api.linkedin.com/v2/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const linkedInId = profileResponse.data.id;

      const client = await db
        .collection("clients")
        .findOne({ _id: new ObjectId(userId) });

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      try {
        let linkedinEntryIndex = -1;
        for (let i = 0; i < client.socialMedia.length; i++) {
          if (client.socialMedia[i].platform === "linkedin") {
            linkedinEntryIndex = i;
            break;
          }
        }

        if (linkedinEntryIndex === -1) {
          const newLinkedinEntry = {
            platform: "linkedin",
            id: linkedInId,
            accessToken: accessToken,
          };
          client.socialMedia.push(newLinkedinEntry);
        } else {
          client.socialMedia[linkedinEntryIndex].id = linkedInId;
          client.socialMedia[linkedinEntryIndex].accessToken = accessToken;
        }
        await db
          .collection("clients")
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { socialMedia: client.socialMedia } }
          );

        console.log("Updated Client:", client);
      } catch (error) {
        console.error("Error:", error);
      }

      res.json({ accessToken, linkedInId });
    } catch (profileError) {
      console.error(
        "Error getting LinkedIn profile:",
        profileError.response.data
      );
      res.status(500).json({ error: "Error getting LinkedIn profile" });
    }
  } catch (error) {
    console.error(
      "Error exchanging authorization code for access token:",
      error
    );
    res
      .status(500)
      .json({ error: "Error exchanging authorization code for access token" });
  }
});

// app.post("/api/linkedin/get-profile", async (req, res) => {
//   try {
//     const { accessToken } = req.body;

//     const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const linkedInId = profileResponse.data.id;

//     res.json({ linkedInId });
//   } catch (error) {
//     console.error("Error getting LinkedIn profile:", error.response.data);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/api/linkedin/post", async (req, res) => {
//   try {
//     const { postText, accessToken, linkedInId } = req.body;

//     const postContent = {
//       owner: `urn:li:person:${linkedInId}`,
//       subject: "My LinkedIn Post",
//       text: {
//         text: postText,
//       },
//     };

//     const postUrl = "https://api.linkedin.com/v2/shares";

//     const postResponse = await axios.post(postUrl, postContent, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     res.json(postResponse.data);
//   } catch (error) {
//     console.error("Error creating LinkedIn post:", error.response.data);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

async function postToLinkedIn(linkedInId, accessToken, postText) {
  try {
    const postContent = {
      owner: `urn:li:person:${linkedInId}`,
      subject: "My LinkedIn Post",
      text: {
        text: postText,
      },
    };

    const postUrl = "https://api.linkedin.com/v2/shares";

    const postResponse = await axios.post(postUrl, postContent, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return postResponse;
  } catch (error) {
    throw error;
  }
}

async function postImageToLinkedIn(userId, accessToken, imageUrl, postText) {
  try {
    const response = await axios.get(imageUrl, { responseType: "stream" });
    if (response.status === 200) {
      const writer = fs.createWriteStream(__dirname + "/image/linkedIn.jpg", {
        flags: "w",
      });
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.pipe(writer);
      });
    }

    const imageBuffer = fs.readFileSync(__dirname + "/image/twitter.jpg");

    const extname = path
      .extname(__dirname + "/image/twitter.jpg")
      .toLowerCase();
    let contentType;
    if (extname === ".jpg" || extname === ".jpeg") {
      contentType = "image/jpg";
    } else if (extname === ".png") {
      contentType = "image/png";
    } else {
      throw new Error("Unsupported image format");
    }

    const registerUploadResponse = await axios.post(
      "https://api.linkedin.com/rest/assets?action=registerUpload",
      {
        registerUploadRequest: {
          owner: `urn:li:person:${userId}`,
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          serviceRelationships: [
            {
              identifier: "urn:li:userGeneratedContent",
              relationshipType: "OWNER",
            },
          ],
          supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202211",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    // console.log(registerUploadResponse);

    const uploadUrl =
      registerUploadResponse.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    const asset = registerUploadResponse.data.value.asset;
    // console.log(uploadUrl);
    // console.log(asset);

    const uploadImageResponse = await axios.put(uploadUrl, imageBuffer, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
    });

    // console.log(uploadImageResponse);

    const createPostResponse = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${userId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: postText,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                description: {
                  text: "",
                },
                media: asset,
                title: {
                  text: "LinkedIn Talent Connect 2021",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(createPostResponse.id);
  } catch (error) {
    console.error("Error posting image on LinkedIn:", error);
    throw "An error occurred while posting the image on LinkedIn";
  }
}

async function postVideoToLinkedIn(userId, accessToken, VideoUrl, postText) {
  try {
    const response = await axios.get(VideoUrl, { responseType: "stream" });
    if (response.status === 200) {
      const writer = fs.createWriteStream(__dirname + "/video/linkedIn.mp4", {
        flags: "w",
      });
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.pipe(writer);
      });
    }
    const extname = path
      .extname(__dirname + "/video/linkedIn.mp4")
      .toLowerCase();
    if (extname === ".jpg" || extname === ".jpeg") {
      contentType = "image/jpeg"; // For JPEG images
    } else if (extname === ".png") {
      contentType = "image/png"; // For PNG images
    } else if (extname === ".mp4") {
      contentType = "video/mp4"; // For MP4 videos
    } else {
      throw new Error("Unsupported file format");
    }

    const VideoBuffer = fs.readFileSync(__dirname + "/video/linkedIn.mp4");
    // console.log(VideoBuffer);
    const initializeUploadResponse = await axios.post(
      "https://api.linkedin.com/rest/videos?action=initializeUpload",
      {
        initializeUploadRequest: {
          owner: `urn:li:person:${userId}`,
          fileSizeBytes: fs.statSync(__dirname + "/video/linkedIn.mp4").size,
          uploadCaptions: false,
          uploadThumbnail: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202308",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );
    const uploadInstructions =
      initializeUploadResponse.data.value.uploadInstructions[0];
    const uploadUrl = uploadInstructions.uploadUrl;
    const video = initializeUploadResponse.data.value.video;
    if (uploadUrl) {
      axios
        .post(uploadUrl, VideoBuffer, {
          headers: {
            "Content-Type": "application/octet-stream",
            "LinkedIn-Version": "202308",
            "X-Restli-Protocol-Version": "2.0.0",
          },
        })
        .then(async (response) => {
          if (response.status === 200) {
            const etag = response.headers["etag"];
            // console.log(etag);
            const finalizeUploadResponse = await axios.post(
              "https://api.linkedin.com/rest/videos?action=finalizeUpload",
              {
                finalizeUploadRequest: {
                  video: `${video}`,
                  uploadToken: "",
                  uploadedPartIds: [`${etag}`],
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                  "LinkedIn-Version": "202308",
                  "X-Restli-Protocol-Version": "2.0.0",
                },
              }
            );

            const apiUrl = "https://api.linkedin.com/rest/posts";

            const postData = {
              author: `urn:li:person:${userId}`,
              commentary: "Sample video Post",
              visibility: "PUBLIC",
              distribution: {
                feedDistribution: "MAIN_FEED",
                targetEntities: [],
                thirdPartyDistributionChannels: [],
              },
              content: {
                media: {
                  title: postText,
                  id: video,
                },
              },
              lifecycleState: "PUBLISHED",
              isReshareDisabledByAuthor: false,
            };

            const response1 = await axios.post(apiUrl, postData, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "LinkedIn-Version": "202308",
                "X-Restli-Protocol-Version": "2.0.0",
              },
            });

            console.log("LinkedIn Post Response:", response1);

            return response1.data;
          } else {
            console.log("HTTP request failed with status:", response.status);
          }
        })
        .catch((error) => {
          console.error("Error uploading video:", error);
        });
    }
  } catch (error) {
    // Handle errors
    console.error("Error uploading video:", error.message);
    throw new Error("Error uploading video");
  }
}

/////////////////////////////////////////////////Twitter api///////////////////////////////////////////////////

const twitterClientId = "WfvHn2TNWJC9OZn7ymJCR0o03";
const twitterClientSecret =
  "m9Ot8iE3TVVwRv7pIxIu6nIP2s6heiiCyxqgZjzr6aCkFyWZc7";
const OAuth = require("oauth-1.0a");

const oauth = OAuth({
  consumer: {
    key: twitterClientId,
    secret: twitterClientSecret,
  },
  signature_method: "HMAC-SHA1",
  hash_function: (baseString, key) => {
    return crypto.createHmac("sha1", key).update(baseString).digest("base64");
  },
});

app.get("/twitter-login", async (req, res) => {
  try {
    const requestData = {
      url: "https://api.twitter.com/oauth/request_token",
      method: "POST",
      data: {
        oauth_callback: "http://localhost:8080/api/twitter/callback",
      },
    };

    const response = await axios.post(requestData.url, null, {
      headers: oauth.toHeader(oauth.authorize(requestData)),
    });

    const requestToken = new URLSearchParams(response.data);
    const oauthToken = requestToken.get("oauth_token");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    const oauthTokenSecret = requestToken.get("oauth_token_secret");
    res.header("Access-Control-Allow-Origin", "*");
    const authUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
    // console.log(authUrl);
    res.send(authUrl);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred during authentication.");
  }
});

app.get("/api/twitter/callback", async (req, res) => {
  const oauthToken = req.query.oauth_token;
  const oauthVerifier = req.query.oauth_verifier;
  // console.log("sadfkjhgfdshgfdhgf");
  try {
    const requestData = {
      url: "https://api.twitter.com/oauth/access_token",
      method: "POST",
      data: {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier,
      },
    };

    const response = await axios.post(requestData.url, null, {
      headers: oauth.toHeader(oauth.authorize(requestData)),
    });

    const accessToken = new URLSearchParams(response.data);
    const userAccessToken = accessToken.get("oauth_token");
    const userAccessTokenSecret = accessToken.get("oauth_token_secret");

    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    const redirectUrl = `http://localhost:3000/Accounts?userAccessToken=${userAccessToken}&userAccessTokenSecret=${userAccessTokenSecret}`;
    // console.log("useracc", userAccessToken);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred during authentication.");
  }
});

///////////////////////////////////////////save twitter tokens to client schema ///////////////////////////////////////////

app.post("/api/twitter/save-tokens", async (req, res) => {
  try {
    const { userId, accessToken, accessSecretToken } = req.body;
    const client = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(userId) });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    try {
      let twitterEntryIndex = -1;
      for (let i = 0; i < client.socialMedia.length; i++) {
        if (client.socialMedia[i].platform === "twitter") {
          twitterEntryIndex = i;
          break;
        }
      }

      if (twitterEntryIndex === -1) {
        const newTwitterEntry = {
          platform: "twitter",
          id: accessSecretToken,
          accessToken: accessToken,
        };
        client.socialMedia.push(newTwitterEntry);
      } else {
        client.socialMedia[twitterEntryIndex].id = accessSecretToken;
        client.socialMedia[twitterEntryIndex].accessToken = accessToken;
      }
      await db
        .collection("clients")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { socialMedia: client.socialMedia } }
        );

      console.log("Updated Client:", client);
    } catch (error) {
      console.error("Error:", error);
    }
    res.json({ message: "Access tokens saved successfully" });
  } catch (error) {
    console.error("Error saving access tokens:", error);
    res.status(500).json({ error: "Error saving access tokens" });
  }
});

///////////////////////////////////////////////// Post on twitter ///////////////////////////////////////////////////////////////
const { TwitterApi } = require("twitter-api-v2");
const { access } = require("fs/promises");

const path2 = require("path");
const postToTwitter = async (
  accessToken,
  accessSecretToken,
  status = "",
  path = ""
) => {
  const twitterApi = new TwitterApi({
    appKey: twitterClientId,
    appSecret: twitterClientSecret,
    accessToken: accessToken,
    accessSecret: accessSecretToken,
  });
  let tweet;
  let vid;
  try {
    if (path !== "") {
      const isVideo = path.endsWith(".mp4");
      const response = await axios.get(path, { responseType: "stream" });
      var imagePath;
      if (response.status === 200) {
        const mediaType = isVideo ? "video" : "image";
        const fileExtension = isVideo ? "mp4" : "jpg";
        const mediaFileName = `twitter.${fileExtension}`;
        const writer = fs.createWriteStream(
          __dirname + `/${mediaType}/${mediaFileName}`,
          {
            flags: "w",
          }
        );
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
          response.data.pipe(writer);
        });
        if (isVideo) {
          vid = await twitterApi.v1.uploadMedia(
            __dirname + "/video/twitter.mp4"
          );
          console.log("vid", vid);
          await twitterApi.v2.tweetThread([
            {
              text: status,
              media: { media_ids: [vid] },
            },
          ]);
        } else {
          vid = await twitterApi.v1.uploadMedia(
            __dirname + "/image/twitter.jpg"
          );
          console.log("vid", vid);
          await twitterApi.v2.tweetThread([
            {
              text: status,
              media: { media_ids: [vid] },
            },
          ]);
        }
      }
    } else if (status !== "") {
      tweet = await twitterApi.v2.tweet(status);
    }
    if (tweet) {
      return tweet;
    } else {
      return vid;
    }
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error("Error posting tweet.");
  }
};

app.post("/twitter-analytics", async (req, res) => {
  const twitterApi = new TwitterApi({
    appKey: twitterClientId,
    appSecret: twitterClientSecret,
    accessToken: req.body.accessToken,
    accessSecret: req.body.accessSecretToken,
  });
  try {
    const meUser = await twitterApi.v2.me({ expansions: ["pinned_tweet_id"] });
    console.log(meUser);
    if (meUser) {
      // console.log("adf");
      // const userTweet = await twitterApi.v2.homeTimeline({
      //   exclude: "replies",
      // });
      // console.log(userTweet);
      const btoken =
        "AAAAAAAAAAAAAAAAAAAAAJn7pAEAAAAA6qnDV%2FGi9xKQHpSbJSwN9GSqXyE%3DUssHmfrPlxAWU1KH5V2wdVRKmS2QOuyFMqpyrLYz38xK7itESt";
      // res.json({ userTweet });
      const apiUrl = `https://api.twitter.com/2/users/${meUser.data.id}/tweets?exclude=replies`;

      try {
        const userTweetResponse = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${btoken}`,
          },
        });

        if (userTweetResponse.status === 200) {
          const userTweet = userTweetResponse.data;
          console.log(userTweet);
          res.json({ userTweet });
        } else {
          console.error("Failed to retrieve user tweets.");
          res.status(500).json({ error: "Failed to retrieve user tweets" });
        }
      } catch (error) {
        console.error("An error occurred while retrieving user tweets:", error);
        res
          .status(500)
          .json({ error: "An error occurred while retrieving user tweets" });
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving user data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving user data" });
  }
});

/////////////////////////////////////////////Google business api's////////////////////////////////////////////

const oauth2Client = new google.auth.OAuth2(
  "82909150064-nrukndkgunfrjuvpqr2868mpckrrp70p.apps.googleusercontent.com",
  "oqyNrgNev2HK1ow2lpF1gwL9VOo3",
  "http://localhost:3000/ClientInfo"
);
app.get("/google_business_access_token", async (req, res) => {
  const authorizationCode = req.query.authorizationCode;

  // Exchange the authorization code for an access token.
  const { tokens } = await oauth2Client.getToken(authorizationCode);
  oauth2Client.setCredentials(tokens);
  // Store the access token in a database or in memory.
  // ...
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
  });

  // Send the access token to the frontend.
  // res.json({ accessToken: tokens.access_token });
});

//////////////////////////////////////////////////Instagram api's///////////////////////////////////////////////

const INSTAGRAM_CLIENT_ID = "164620079922221";
const INSTAGRAM_CLIENT_SECRET = "eba708d0604d25fd1ee5da06d10c109a";
const INSTAGRAM_REDIRECT_URI =
  "https://7868-103-170-182-172.ngrok-free.app/instagram-callback";
const POST_MEDIA_SCOPE =
  "user_profile,user_media,instagram_basic,instagram_content_publish,pages_read_engagement";
const querystring = require("querystring");

const createMediaObjectContainer = async (
  instagramAccountId,
  imageUrl,
  postCaption,
  facebookUserAccessToken
) => {
  const apiUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media`;

  const postData = {
    access_token: facebookUserAccessToken,
    image_url: imageUrl,
    caption: postCaption,
  };

  return axios
    .post(apiUrl, postData)
    .then((response) => response.data.id)
    .catch((error) => {
      throw new Error(
        `Error creating media object container: ${error.message}`
      );
    });
};

const publishMediaObjectContainer = async (
  instagramAccountId,
  mediaObjectContainerId,
  facebookUserAccessToken
) => {
  const apiUrl = `https://graph.facebook.com/v17.0/${instagramAccountId}/media_publish`;

  const postData = {
    access_token: facebookUserAccessToken,
    creation_id: mediaObjectContainerId,
  };

  return axios
    .post(apiUrl, postData)
    .then((response) => response.data.id)
    .catch((error) => {
      throw new Error(
        `Error publishing media object container: ${error.message}`
      );
    });
};

app.get("/instagram-auth", (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    INSTAGRAM_REDIRECT_URI
  )}&scope=user_profile,user_media&response_type=code`;
  res.send(authUrl);
});

app.get("/instagram-callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      querystring.stringify({
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: INSTAGRAM_REDIRECT_URI,
        code: code,
      })
    );

    const userAccessToken = tokenResponse.data.access_token;
    const userPageId = tokenResponse.data.user_id;

    res.redirect(
      `http://localhost:3000/Accounts?accessToken=${userAccessToken}&pageId=${userPageId}`
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
});

// app.post("/create-container", async (req, res) => {
//   const IG_USER_ID = req.body.pageId;
//   const IG_ACCESS_TOKEN = req.body.accessToken;

//   try {
//     // const imageUrl = img;
//     const caption = "#BronzFonz";
//     const containerResponse = await axios.post(
//       `https://graph.instagram.com/v17.0/${IG_USER_ID}/media`,
//       null,
//       {
//         params: {
//           // image_url: imageUrl,
//           caption: caption,
//           access_token: IG_ACCESS_TOKEN,
//         },
//       }
//     );
//     console.log("asdf", containerResponse);
//   } catch (error) {
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

app.post("/api/instagram/save-tokens", async (req, res) => {
  try {
    const { userId, pageId, accessToken } = req.body;
    const client = await db
      .collection("clients")
      .findOne({ _id: new ObjectId(userId) });

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    try {
      let isntaEntryIndex = -1;
      for (let i = 0; i < client.socialMedia.length; i++) {
        if (client.socialMedia[i].platform === "insta") {
          isntaEntryIndex = i;
          break;
        }
      }

      if (isntaEntryIndex === -1) {
        const newInstaEntry = {
          platform: "insta",
          id: pageId,
          accessToken: accessToken,
        };
        client.socialMedia.push(newInstaEntry);
      } else {
        client.socialMedia[isntaEntryIndex].id = pageId;
        client.socialMedia[isntaEntryIndex].accessToken = accessToken;
      }
      await db
        .collection("clients")
        .updateOne(
          { _id: new ObjectId(userId) },
          { $set: { socialMedia: client.socialMedia } }
        );

      console.log("Updated Client:", client);
    } catch (error) {
      console.error("Error:", error);
    }
    res.json({ message: "Access tokens saved successfully" });
  } catch (error) {
    console.error("Error saving access tokens:", error);
    res.status(500).json({ error: "Error saving access tokens" });
  }
});

/////////////////////////////////////////// Schduler rotues ////////////////////////////////////////////////////

const schedule = require("node-schedule");
const moment = require("moment-timezone");

////////////////////////////////////////// Facebook schdulers //////////////////////////////////////////////

app.post("/api/schedule-facebook-post", (req, res) => {
  const { pageAccessToken, pageId, message, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  const scheduldate = moment(scheduledDate);
  const uuu =
    scheduldate.tz("America/Los_Angeles").format("YYYY-MM-DDTHH:mm:ss.SSS") +
    "Z";
  console.log(scheduledDate);
  console.log(uuu);
  const job = schedule.scheduleJob(uuu, async () => {
    try {
      const job = schedule.schedule;
      await postToFBPage(pageId, pageAccessToken, message);
      console.log("Scheduled post success");
    } catch (error) {
      console.error(
        "Error posting to page:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "Post scheduled successfully" });
});

app.post("/api/schedule-facebook-photo", (req, res) => {
  const { pageAccessToken, pageId, photoUrl, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  const scheduldate = moment(scheduledDate);
  const uuu =
    scheduldate.tz("America/Los_Angeles").format("YYYY-MM-DDTHH:mm:ss.SSS") +
    "Z";
  console.log(scheduledDate);
  console.log(uuu);
  const job = schedule.scheduleJob(uuu, async () => {
    try {
      const uploadResult = await uploadPhotoToFacebook(
        pageId,
        photoUrl,
        pageAccessToken
      );
      if (uploadResult.success) {
        console.log("Scheduled photo upload success");
      } else {
        console.error(
          "Error uploading photo to Facebook:",
          uploadResult.data || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Error scheduling photo upload:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "Photo upload scheduled successfully" });
});

app.post("/api/schedule-facebook-video", (req, res) => {
  const { pageAccessToken, pageId, message, photoUrl, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  // console.log("ASDFd");
  const scheduldate = moment(scheduledDate);
  const uuu =
    scheduldate.tz("America/Los_Angeles").format("YYYY-MM-DDTHH:mm:ss.SSS") +
    "Z";
  console.log(scheduledDate);
  console.log(uuu);
  const job = schedule.scheduleJob(uuu, async () => {
    try {
      const uploadResult = await uploadVideoToFacebook(
        pageId,
        photoUrl,
        pageAccessToken,
        message
      );
      if (uploadResult.success) {
        console.log("Scheduled vid upload success");
      } else {
        console.error(
          "Error uploading vid to Facebook:",
          uploadResult.data || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Error scheduling photo upload:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "Photo upload scheduled successfully" });
});

/////////////////////////////////////////////// Linkedin Schduler /////////////////////////////////////////////

app.post("/api/schedule-linkedin-post", (req, res) => {
  const { accessToken, linkedInId, postText, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  // console.log(req.body);
  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
      const postResponse = await postToLinkedIn(
        linkedInId,
        accessToken,
        postText
      );
      console.log("Scheduled LinkedIn post success:", postResponse.data);
    } catch (error) {
      console.error(
        "Error scheduling LinkedIn post:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "LinkedIn post scheduled successfully" });
});

app.post("/api/schedule-linkedin-image", (req, res) => {
  const { accessToken, linkedInId, postText, imageUrl, scheduleTime } =
    req.body;
  const scheduledDate = new Date(scheduleTime);
  // console.log(req.body);
  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
      // userId, accessToken, imageUrl, postText
      const postResponse = await postImageToLinkedIn(
        linkedInId,
        accessToken,
        imageUrl,
        postText
      );
      console.log("Scheduled LinkedIn post success:", postResponse.data);
    } catch (error) {
      console.error(
        "Error scheduling LinkedIn post:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "LinkedIn post scheduled successfully" });
});

app.post("/api/schedule-linkedin-video", (req, res) => {
  const { accessToken, linkedInId, postText, videoUrl, scheduleTime } =
    req.body;
  const scheduledDate = new Date(scheduleTime);
  // console.log(req.body);
  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
      // userId, accessToken, imageUrl, postText
      const postResponse = await postVideoToLinkedIn(
        linkedInId,
        accessToken,
        videoUrl,
        postText
      );
      console.log("Scheduled LinkedIn post success:", postResponse.data);
    } catch (error) {
      console.error(
        "Error scheduling LinkedIn post:",
        error.response?.data || error.message
      );
    }
  });
  res.json({ success: true, message: "LinkedIn post scheduled successfully" });
});

//////////////////////////////////////////////// Twiiter Schduler /////////////////////////////////////////////

app.post("/schedule-twitter-post", (req, res) => {
  const { accessToken, accessSecretToken, status, scheduleTime, path } =
    req.body;
  // console.log("!", path);
  const scheduledDate = new Date(scheduleTime);
  // console.log(accessToken, status, path);
  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
      if (typeof path !== "undefined") {
        const tweet = await postToTwitter(
          accessToken,
          accessSecretToken,
          status,
          path
        );
        console.log("Scheduled tweet success:", tweet);
      } else {
        const tweet = await postToTwitter(
          accessToken,
          accessSecretToken,
          status
        );
        console.log("Scheduled tweet success:", tweet);
      }
    } catch (error) {
      console.error(
        "Error posting scheduled tweet:",
        error.message || error.response?.data || error
      );
    }
  });
  res.json({ success: true, message: "Tweet scheduled successfully" });
});

//////////////////////////////////////////////// Instagram Schduler ///////////////////////////////////////////

app.post("/schedule-instagram-post", (req, res) => {
  const {
    instagramAccountId,
    imageUrl,
    postCaption,
    scheduleTime,
    facebookUserAccessToken,
  } = req.body;

  const scheduledDate = new Date(scheduleTime);

  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
      const mediaObjectContainerId = await createMediaObjectContainer(
        instagramAccountId,
        imageUrl,
        postCaption,
        facebookUserAccessToken
      );

      await publishMediaObjectContainer(
        instagramAccountId,
        mediaObjectContainerId,
        facebookUserAccessToken
      );

      console.log("Scheduled Instagram post success");
    } catch (error) {
      console.error(
        "Error posting scheduled Instagram post:",
        error.message || error.response?.data || error
      );
    }
  });

  res.json({ success: true, message: "Instagram post scheduled successfully" });
});

/////////////////////////////////////////////////////export route///////////////////////////////////////////////
