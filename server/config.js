// config.js
const { MongoClient } = require("mongodb");

// const url = 'mongodb://localhost:27017';
const dbName = "SMM";

// const client = new MongoClient(url);

module.exports = {
  connect: async () => {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName);
  },
  close: async () => {
    await client.close();
    console.log("Disconnected from MongoDB");
  },
};

// MongoDB Atlas connection string
const url =
  // "mongodb+srv://anikghosh670:dV64U6CUyIZNoQoT@smm.kqbsjkz.mongodb.net/SMM?retryWrites=true&w=majority";
"mongodb+srv://animesh:animesh@cluster0.ezibghm.mongodb.net/SMM?retryWrites=true&w=majority";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

////////////////////////////////Their server/////////////////////////////
module.exports = {
  connect: async () => {
    try {
      await client.connect();
      console.log("Connected to MongoDB Atlas");
      return client.db();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  },
  close: async () => {
    await client.close();
    console.log("Disconnected from MongoDB Atlas");
  },
};
