const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  socialMedia: [
    {
      platform: {
        type: String,
        required: true,
        enum: ["facebook", "insta", "twitter", "linkedin", "google"],
      },
      id: {
        type: String,
        required: false,
      },
      accessToken: {
        type: String,
        required: false,
      },
    },
  ],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Client = mongoose.model("Client", clientSchema);

module.exports = { Client };
