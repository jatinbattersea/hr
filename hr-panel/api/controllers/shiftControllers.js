const asyncHandler = require("express-async-handler");
const { Shift } = require("../models/shiftModel");
const Attendence = require("../models/attendenceModel");
const Employee = require("../models/employeeModel");

//get shifts
const getShifts = asyncHandler(async (req, res) => {

    try {
        const shifts = await Shift.find({});
        res.status(200).json(shifts);
    } catch (err) {
        res.status(500).json(err);
    }

});

//get shift
const getShift = asyncHandler(async (req, res) => {

    try {
        const shift = await Shift.findOne({
            name: req.params.name
        });
        res.status(200).json(shift);
    } catch (err) {
        res.status(500).json(err);
    }

});

// add shift
const addShift = asyncHandler(async (req, res, next) => {
    const { name, startTime, endTime } = req.body;

    if (!name || !startTime || !endTime) {
        res.status(400);
        throw new Error("Please Enter all the Feilds !");
    }

    const shiftExists = await Shift.find({ name: name });

    if (shiftExists) {
        res.status(400);
        Error("Shift already exists !");
    }

    const shift = await Shift.create({
        name,
        startTime,
        endTime, 
    });

    if (shift) {

        res.status(201).json("Shift generated successfully !");
    } else {
        res.status(400);
        throw new Error("Something went wrong !");
    }
});

//update shift
const updateShift = asyncHandler(async (req, res) => {
    try {
        await Shift.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        });

        await Employee.updateMany({
            shift: {
                _id: req.params.id
            },
            shift: req.body
        })

        res.status(200).json("Shift has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }
})

// delete Attendence
const deleteShift = asyncHandler(async (req, res) => {

    try {
        await Shift.findByIdAndDelete(req.params.id);
        res.status(200).json("Shift has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }

});

module.exports = { getShifts, getShift, addShift, updateShift, deleteShift };