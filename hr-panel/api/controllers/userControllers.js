const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeModel");
const User = require("../models/userModel");
const { Shift } = require("../models/shiftModel");

//get a user
// const getUser = asyncHandler(async (req, res) => {
//     const userId = req.query.userId;
//     const keyword = req.query.search
//         ? {
//             $or: [
//                 { name: { $regex: req.query.search, $options: "i" } },
//                 { email: { $regex: req.query.search, $options: "i" } },
//             ],
//         }
//         : {};
//     if (userId) {
//         const user = await User.findById(userId);
//         const { password, updatedAt, ...other } = user._doc;
//         res.status(200).json(other);
//     } else {
//         const projection = {
//             name: 1,
//             email: 1,
//             dob: 1,
//             profileImage: 1,
//             designation: 1,
//             department: 1,
//             location: 1,
//             createdAt: 1,
//             updatedAt: 1,
//         };
//         const users = await User.find(keyword, projection);
//         (users.length !== 0) ? res.status(200).json(users) : res.status(200).json({"message": "No user Found !"});
        
//     }
// });

// Add Member
const addMember = asyncHandler(async (req, res) => {
    const { name, email, phone, employeeID, password, doj, dob, designation, team, profileImage, address, bankName, accNo, ifsc, shiftName} = req.body;

    if (!name || !email || !phone || !employeeID || !password || !doj || !dob || !designation || !team || !address) {
        res.status(400);
        throw new Error("Please Enter all the Feilds !");
    }

    const employeeExists = await User.findOne({ email });
    const shift = await Shift.findOne({ name: shiftName });

    if (employeeExists) {
        res.status(400);
        Error("User already exists !");
    }

    const employee = await Employee.create({
        name,
        email,
        phone,
        employeeID,
        password,
        address,
        dob,
        doj,
        profileImage,
        designation,
        team,
        bankName,
        accNo,
        ifsc,
        shift
    });

    if (employee) {

        const authorizedPages = ["/", "/holidays", "/profile"];

        await User.create({
            _id: employee._id,
            email,
            phone,
            employeeID,
            designation,
            password,
            authorizedPages,
        });

        res.status(201).json({
            message: "User registered successfully !"
        });
    } else {
        res.status(400);
        throw new Error("Something went wrong !");
    }
})

// Get Members
const getMembers = asyncHandler(async (req, res) => {
    const filter = {};
    try {
        let all = await Employee.find(filter);

        // Prevent from getting admin details
        all = all.filter((doc) => {
            if (doc.designation != "Admin") return doc
        })

        res.status(200).json(all);
    } catch (error) {
        console.log(error);
    }
})

// Get User
const getUser = asyncHandler(async (req, res) => {
    const filter = { employeeID: req.params.employeeID };
    try {
        const user = await Employee.findOne(filter);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
})

const uploadFile = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json(req.file.filename);
    } catch (error) {
        console.error(error);
    }
})

//update user
const updateUser = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await User.findByIdAndUpdate(req.params.id, {
            $set: {
                email: req.body.email,
                phone: req.body.phone,
                employeeID: req.body.employeeID,
                designation: req.body.designation,
                password: req.body.password,
            },
        });

        res.status(200).json("User has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }
})

//get User Specific Data
const getUserSpecificData = asyncHandler(async (req, res) => {
    try {
        const requestedData = await Employee.find().select({
            "employeeID": 1,
            "shift": 1,
        });

        res.status(200).json(requestedData);
    } catch (err) {
        return res.status(500).json(err);
    }
})


//change Password
const changePassword = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndUpdate(req.body.id, {
            $set: {
                password: req.body.confirmPassword,
            },
        });

        await User.findByIdAndUpdate(req.body.id, {
            $set: {
                password: req.body.confirmPassword,
            },
        });

        res.status(200).json("Password Changed Succesfully!");
    } catch (err) {
        return res.status(500).json(err);
    }
})

//delete user
const deleteUser = asyncHandler(async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json("User has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }
})
// module.exports = { allUsers, registerUser, authUser };
module.exports = { addMember, getMembers, getUser, updateUser, deleteUser, changePassword, getUserSpecificData, uploadFile };