const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const { MongoClient } = require("mongodb");
const passport = require("passport");
const crypto = require("crypto");
const session = require("express-session");
const { google } = require("googleapis");
const secretKey = crypto.randomBytes(32).toString("hex");
const app = express();
const port = 5000;
const { Task, Manager } = require("./models/SuperAdmin");
const { Client } = require("./models/Client");

const url = "mongodb+srv://animesh:animesh@cluster0.ezibghm.mongodb.net/";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/////////////////////////////////////////////data base connection/////////////////////////////////////////////////////////////

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
// app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
  console.log(`Akshay is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

//////////////////////////////////////////Super Admin/////////////////////////////////////////////////////

////////////////////////////////////////////Add Tasks/////////////////////////////////////////////////////

app.post("/add_task", (req, res) => {
  const { site, description, client, clientId, lastModified, dueDate } =
    req.body;

  console.log(req.body);

  const newTask = new Task({
    site,
    description,
    client,
    clientId,
    lastModified,
    dueDate,
  });
  newTask
    .save()
    .then((savedTask) => {
      res.json(savedTask);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to save the task." });
    });
});

////////////////////////////////////////////Get tasks/////////////////////////////////////

app.get("/get_tasks", (req, res) => {
  Task.find()
    .then((tasks) => {
      res.json(tasks);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch tasks." });
    });
});

/////////////////////////////get client task ////////////////////////////////////////////

app.post("/get_tasks_by_client", async (req, res) => {
  try {
    const { clientId } = req.body;
    const tasks = await Task.find({ clientId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//////////////////////////// get manager task ////////////////////////////////////////////

app.post("/get_tasks_by_manager", async (req, res) => {
  try {
    const { managerId } = req.body; // Extract managerId from the request body
    const manager = await Manager.findById(managerId).populate("tasks");

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const tasks = manager.tasks;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////////////////////Update Task///////////////////////////////////////

app.put("/update_tasks/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
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
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Error updating task last modified date:", error);
    res.status(500).json({ error: "Failed to update task." });
  }
});

//////////////////////////////// get events for schduler ///////////////////////////////////

app.post("/get_events", async (req, res) => {
  try {
    const { managerId } = req.body;
    const manager = await Manager.findById(managerId).populate("tasks");
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }
    const events = manager.tasks.map((task) => ({
      label: task.client,
      dateStart: task.dueDate, // Assuming dueDate represents start date
      dateEnd: task.dueDate, // Assuming dueDate represents end date
      allDay: false, // Assuming tasks are not all-day events
      description: task.site,
      status: task.isCompleted === "Pending" ? "unconfirmed" : "confirmed",
      backgroundColor: task.isCompleted === "Pending" ? "red" : "green", // Adjust as needed
    }));

    res.json(events);
  } catch (error) {
    console.error("Error fetching manager's tasks:", error);
    res.status(500).json({ error: "Error fetching manager's tasks" });
  }
});

////////////////////////////////////////add manager/////////////////////////////////////////

app.post("/add_manager", (req, res) => {
  const { id, name } = req.body;

  const newManager = new Manager({
    id,
    name,
  });

  newManager
    .save()
    .then((savedManager) => {
      res.json(savedManager);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to save the manager." });
    });
});

/////////////////////////////////////get manager///////////////////////////////////////

app.get("/get_managers", (req, res) => {
  Manager.find()
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

  Manager.findOne({ email })
    .then((manager) => {
      if (manager) {
        res.json({ managerId: manager._id });
      } else {
        res.status(404).json({ error: "Manager not found." });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch manager by email." });
    });
});

/////////////////////////////////get manager by id//////////////////////////////////////

app.post("/get_manager_id/", async (req, res) => {
  try {
    const managerId = req.body.id;
    const manager = await Manager.findById(managerId);

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

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const manager = await Manager.findById(managerId);
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
    manager.tasks.push(task._id);

    await task.save();
    await manager.save();

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

    const existingClient = await Client.findOne({ email });

    if (existingClient) {
      return res.json({ clientId: existingClient._id });
    } else {
      const newClient = new Client({
        name,
        email,
        socialMedia: [],
        tasks: [],
      });

      await newClient.save();
      res.json({ clientId: newClient._id });
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
    const client = await Client.findById(clientId);
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
    const { managerId } = req.body;
    const manager = await Manager.findById(managerId).populate("tasks");

    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    const clientIds = manager.tasks.map((task) => task.clientId);
    const clients = await Client.find({ _id: { $in: clientIds } });

    res.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Error fetching clients" });
  }
});

/////////////////////////////////////////////Facebook api's////////////////////////////////////////////

const FACEBOOK_APP_ID = "959234698469542";
const FACEBOOK_APP_SECRET = "f7586846bdea68a989725c41901b307f";
// const PAGE_ID = "109798618876119";

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

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v17.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${userAccessToken}`
    );

    const facebookPages = await getFacebookPages(userAccessToken);

    const longLivedUserToken = response.data.access_token;

    const client = await Client.findOne({ _id: userId });
    let pageAccessToken = "";
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    const facebookEntry = client.socialMedia.find(
      (entry) => entry.platform === "facebook"
    );

    if (!facebookEntry) {
      console.log("Facebook entry not found in social media");
      return res
        .status(404)
        .json({ error: "Facebook entry not found in social media" });
    }

    if (facebookPages.length > 0) {
      const firstPageId = facebookPages[0].id;
      facebookEntry.id = firstPageId;
      const pageResponse = await axios.get(
        `https://graph.facebook.com/${firstPageId}?fields=access_token&access_token=${longLivedUserToken}`
      );

      pageAccessToken = pageResponse.data.access_token;
      facebookEntry.accessToken = pageAccessToken;
    }

    await client.save();

    res.json({ pageAccessToken });
  } catch (error) {
    console.error("Error getting page access token:", error.response.data);
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
  try {
    const response = await axios.post(
      `https://graph.facebook.com/${pageId}/feed`,
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
  try {
    const apiUrl = `https://graph.facebook.com/${pageId}/photos`;
    const params = new URLSearchParams({
      url: photoUrl,
      access_token: pageAccessToken,
    });

    const response = await axios.post(`${apiUrl}?${params.toString()}`);

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

      const client = await Client.findOne({ _id: userId });

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const linkedinEntry = client.socialMedia.find(
        (entry) => entry.platform === "linkedin"
      );

      if (!linkedinEntry) {
        return res
          .status(404)
          .json({ error: "LinkedIn entry not found in social media" });
      }
      linkedinEntry.id = linkedInId;
      linkedinEntry.accessToken = accessToken;

      await client.save();

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
        oauth_callback: "http://localhost:5000/api/twitter/callback",
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
    res.send(authUrl);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred during authentication.");
  }
});

app.get("/api/twitter/callback", async (req, res) => {
  const oauthToken = req.query.oauth_token;
  const oauthVerifier = req.query.oauth_verifier;
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

    const redirectUrl = `http://localhost:3000/ClientInfo?userAccessToken=${userAccessToken}&userAccessTokenSecret=${userAccessTokenSecret}`;
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
    const client = await Client.findOne({ _id: userId });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const twitterEntry = client.socialMedia.find(
      (entry) => entry.platform === "twitter"
    );
    if (!twitterEntry) {
      return res
        .status(404)
        .json({ error: "Twitter entry not found in social media" });
    }
    twitterEntry.accessToken = accessToken;
    twitterEntry.id = accessSecretToken;
    await client.save();
    res.json({ message: "Access tokens saved successfully" });
  } catch (error) {
    console.error("Error saving access tokens:", error);
    res.status(500).json({ error: "Error saving access tokens" });
  }
});

///////////////////////////////////////////////// Post on twitter ///////////////////////////////////////////////////////////////
const { TwitterApi } = require("twitter-api-v2");
const { access } = require("fs/promises");

// app.post("/post-tweet", async (req, res) => {
//   const { accessToken, accessTokenSecret } = req.body;

//   const twitterApi = new TwitterApi({
//     appKey: twitterClientId,
//     appSecret: twitterClientSecret,
//     accessToken: accessToken,
//     accessSecret: accessTokenSecret,
//   });
//   try {
//     const { status } = req.body;
//     const tweet = await twitterApi.v2.tweet(status);
//     res.json({ tweet });
//   } catch (error) {
//     console.error("Error posting tweet:", error);
//     res.status(500).json({ success: false, error: "Error posting tweet." });
//   }
// });

const postToTwitter = async (
  accessToken,
  accessSecretToken,
  status,
  path = ""
) => {
  const twitterApi = new TwitterApi({
    appKey: twitterClientId,
    appSecret: twitterClientSecret,
    accessToken: accessToken,
    accessSecret: accessSecretToken,
  });

  try {
    // const tweet = await twitterApi.v2.tweet(status);
    // // // if (path !== "") {
    // // const urlObject = new URL(path);
    // // const validPath = urlObject.toString();
    const vid = await twitterApi.v1.uploadMedia("./uploads/200.jpg");
    // }

    return vid;
  } catch (error) {
    console.error("Error posting tweet:", error);
    throw new Error("Error posting tweet.");
  }
};

/////////////////////////////////////////////Google business api's////////////////////////////////////////////

const oauth2Client = new google.auth.OAuth2(
  "948825829584-3p3htg679sieqvu5hmt22oa0ppiqfpih.apps.googleusercontent.com",
  "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",
  "http://localhost:5000/oauth-callback"
);

app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/business.manage"],
  });
  res.redirect(authUrl);
});

app.get("/oauth-callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    res.redirect(
      `http://localhost:3000/ClientInfo?access_token=${tokens.access_token}`
    );
  } catch (error) {
    console.error("Error getting tokens:", error.message);
    res.status(500).send("An error occurred during authorization.");
  }
});

app.post("/get-id", async (req, res) => {
  const { access_token } = req.body;
  try {
    const accountsResponse = await axios.get(
      "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const accountId = accountsResponse.data.accounts[0].name;
    const locationsResponse = await axios.get(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const locationId = locationsResponse.data.locations[0].name;
    res.json({ accountId, locationId });
  } catch (error) {
    console.error("Error fetching accounts:", error.response.data);
    res
      .status(500)
      .json({ error: "An error occurred while fetching accounts." });
  }
});

app.post("/create-local-post", async (req, res) => {
  const { access_token, accountId, locationId } = req.body;

  const postRequestBody = {
    languageCode: "en-US",
    summary: "Come in for our spooky Halloween event!",
    event: {
      title: "Halloween Spook-tacular!",
      schedule: {
        startDate: {
          year: 2017,
          month: 10,
          day: 31,
        },
        startTime: {
          hours: 9,
          minutes: 0,
          seconds: 0,
          nanos: 0,
        },
        endDate: {
          year: 2017,
          month: 10,
          day: 31,
        },
        endTime: {
          hours: 17,
          minutes: 0,
          seconds: 0,
          nanos: 0,
        },
      },
    },
    media: [
      {
        mediaFormat: "PHOTO",
        sourceUrl: "https://www.google.com/real-image.jpg",
      },
    ],
    topicType: "EVENT",
  };

  try {
    const createPostResponse = await axios.post(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/localPosts`,
      postRequestBody,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const createdPost = createPostResponse.data;
    res.json({ createdPost });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

//////////////////////////////////////////////////Instagram api's///////////////////////////////////////////////

const INSTAGRAM_CLIENT_ID = "164620079922221";
const INSTAGRAM_CLIENT_SECRET = "eba708d0604d25fd1ee5da06d10c109a";
const INSTAGRAM_REDIRECT_URI =
  "https://7868-103-170-182-172.ngrok-free.app/instagram-callback";
const POST_MEDIA_SCOPE =
  "user_profile,user_media,instagram_basic,instagram_content_publish,pages_read_engagement";
const querystring = require("querystring");

const createMediaObjectContainer = (
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

const publishMediaObjectContainer = (
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

    // console.log(tokenResponse);
    const userAccessToken = tokenResponse.data.access_token;
    const userPageId = tokenResponse.data.user_id;

    res.redirect(
      `http://localhost:3000/ClientInfo?accessToken=${userAccessToken}&pageId=${userPageId}`
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred");
  }
});

app.post("/create-container", async (req, res) => {
  const IG_USER_ID = req.body.pageId;
  const IG_ACCESS_TOKEN = req.body.accessToken;
  // console.log(IG_USER_ID);
  try {
    // const imageUrl = img;
    const caption = "#BronzFonz";
    const containerResponse = await axios.post(
      `https://graph.instagram.com/v17.0/${IG_USER_ID}/media`,
      null,
      {
        params: {
          // image_url: imageUrl,
          caption: caption,
          access_token: IG_ACCESS_TOKEN,
        },
      }
    );
    console.log("asdf", containerResponse);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/api/instagram/save-tokens", async (req, res) => {
  try {
    const { userId, pageId, accessToken } = req.body;
    const client = await Client.findOne({ _id: userId });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const instagramEntry = client.socialMedia.find(
      (entry) => entry.platform === "insta"
    );

    if (!instagramEntry) {
      return res
        .status(404)
        .json({ error: "Instagram entry not found in social media" });
    }
    instagramEntry.id = pageId;
    instagramEntry.accessToken = accessToken;
    await client.save();
    res.json({ message: "Page ID and access token saved successfully" });
  } catch (error) {
    console.error("Error saving Instagram tokens:", error);
    res.status(500).json({ error: "Error saving Instagram tokens" });
  }
});

/////////////////////////////////////////// Schduler rotues ////////////////////////////////////////////////////

const schedule = require("node-schedule");

////////////////////////////////////////// Facebook schdulers //////////////////////////////////////////////

app.post("/api/schedule-facebook-post", (req, res) => {
  const { pageAccessToken, pageId, message, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  const job = schedule.scheduleJob(scheduledDate, async () => {
    try {
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

app.post("/api/schedule-facebook-upload-photo", (req, res) => {
  const { pageAccessToken, pageId, photoUrl, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
  const job = schedule.scheduleJob(scheduledDate, async () => {
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

/////////////////////////////////////////////// Linkedin Schduler /////////////////////////////////////////////

app.post("/api/schedule-linkedin-post", (req, res) => {
  const { accessToken, linkedInId, postText, scheduleTime } = req.body;
  const scheduledDate = new Date(scheduleTime);
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

//////////////////////////////////////////////// Twiiter Schduler /////////////////////////////////////////////

app.post("/schedule-twitter-post", (req, res) => {
  const { accessToken, accessSecretToken, status, scheduleTime, path } =
    req.body;

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

module.exports = app;
