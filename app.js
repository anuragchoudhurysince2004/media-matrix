const express = require("express");
const path = require("path");
const pug = require("pug");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
//allowing expreses to use static file
app.use(express.static(`${__dirname}/public`));

//setting pug ans view renderer
app.set(path.join(__dirname, "./views"));
app.set("view engine", "pug");

//routes
const authRoutes = require("./routes/authRoutes");
// const protectedRoutes = require("./routes/protectedRoutes");
const viewRoutes = require("./routes/viewRoutes");
app.use("/", viewRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/apt/v1", authRoutes);
// app.use("/protected", protectedRoutes);
function getSentimentClass(sentiment) {
  if (sentiment === 1) {
    return "positive";
  } else if (sentiment === -1) {
    return "negative";
  } else {
    return "neutral";
  }
}

app.locals.getSentimentClass = getSentimentClass;

module.exports = app;
