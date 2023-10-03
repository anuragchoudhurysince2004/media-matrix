const express = require("express");
const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");
const browserSync = require("browser-sync");
const sendEmail = require("./utils/mail");

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
//this is only for dev purpose for auto reloading the web browser

// browserSync.init({
//     proxy: "http://localhost:3000",
//     files: ["./public/styles/*.css", "./public/scripts/*.js", "./views/*.pug"],
//     open: false,
//     basedir: "./",
//     awaitWriteFinish: true,

//     injectChanges: false,
// });

// EMAIL_HOST=sandbox.smtp.mailtrap.io
// EMAIL_PORT=25
// EMAIL_USERNAME=58347d3e18e7aa
// EMAIL_PASSWORD=165b070f0c33e0
// email
// mfll hamd avct omlz
