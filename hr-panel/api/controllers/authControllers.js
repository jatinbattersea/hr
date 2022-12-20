const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Login
const loginUser = asyncHandler(async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeID: req.body.id
        });
        const user = await User.findOne({
            employeeID: req.body.id
        });
        const match = (req.body.password === employee.password);
        // console.log(match);
        if (!match) return res.status(400).json({ msg: "Invalid Credentials" });
        const userId = employee._id;
        const name = employee.name;
        const email = employee.email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30d'
        });
        res.cookie('userJwt', accessToken, { expires: new Date(Date.now() + 25892000000) });
        res.json({ ...employee, authorizedPages: user.authorizedPages, accessToken });
    } catch (error) {
        res.status(404).json({ msg: "User not found" });
    }
})

module.exports = { loginUser };