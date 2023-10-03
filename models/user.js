const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "username is required for creating a account"],
        unique: [true, "Another user is using the same email please try again"],
    },
    password: {
        type: String,
        required: [true, "password is required for creating a account"],
    },
    name: {
        type: String,
        // required: [true, "Name is required for creating a account"],
    },
    department: {
        type: String,
        // required: [true, "Department of PIB officer is must"],
    },
});
module.exports = mongoose.model("user", userSchema);
