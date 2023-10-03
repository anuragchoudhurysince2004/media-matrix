const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });
// MongoDB connection settings
const uri = process.env.DATABASE.replace("<password>", process.env.PASSWORD); // Replace with your MongoDB connection string

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
exports.client = client;
