const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT;

//connection with data base
const url = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful to database");
  });

//starting the server
app.listen(process.env.PORT, () => {
  console.log(`The server is Listing on port ${PORT}`);
});
