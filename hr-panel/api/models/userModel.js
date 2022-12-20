const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            unique: true,
            required: true,
        },
        employeeID: {
            type: String,
            required: true,
            unique: true,
        },
        designation: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        authorizedPages: {
            type: Array,
            default: []
        } 
    },
    {
        timeStamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;