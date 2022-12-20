const asyncHandler = require("express-async-handler");
const fs = require("fs");
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const Attendence = require("../models/attendenceModel");

// add attendence
const addAttendence = asyncHandler(async (req, res, next) => {
    
    var exceltojson;
    //  Multer gives us file info in req.file object 
    if (!req.file) {
        res.json({ error_code: 1, err_desc: "No file passed" });
        return;
    }
    // Check the extension of the incoming file and use the appropriate module
    if (
        req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
        ] === "xlsx"
    ) {
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }
    try {
        exceltojson(
            {
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            },
            function (err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }

                const year = req.body.year;
                const month = req.body.month;
                let tempIds = [];
                result.map((d) => {
                    if (!tempIds.includes(d.employeeid)) {
                        tempIds.push(d.employeeid);
                    }
                });
                for (i = 0; i < tempIds.length; i++) {

                    let schedule = {};

                    let tempData = result.filter((row) => {
                        return row.employeeid == tempIds[i];
                    });

                    if (tempData != "") {

                        let name = tempData[0].name;
                        let employeeID = tempData[0].employeeid;

                        tempData.map((d) => {
                            schedule[d.date] = {
                                timeIn: d["time-in"],
                                timeOut: d["time-out"]
                            }
                        });

                        const AttendenceDoc = new Attendence({
                            employeeID,
                            name,
                            year,
                            month,
                            schedule,
                        });

                        AttendenceDoc.save((err, cust) => {
                            if (err) return console.error(err);
                        });
                        
                    }
                }
                res.status(200).json({
                    dataUpdated: true
                });
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    console.log(e)
                }
            }
        );
    } catch (e) {
        res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }

});

//get attendence
const getAttendence = asyncHandler(async (req, res) => {

    try {
        const attendence = await Attendence.find({
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).json(attendence);
    } catch (err) {
        res.status(500).json(err);
    }

});

const getEmployeeAttendence = asyncHandler(async (req, res) => {

    try {
        const attendence = await Attendence.find({
            employeeID: req.params.employeeId,
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).json(attendence);
    } catch (error) {
        res.status(500).json(err);
    }
})

// delete Attendence
const deleteAttendence = asyncHandler(async (req, res) => {

    try {
        await Attendence.deleteMany({
            year: req.params.year,
            month: req.params.month,
        });
        res.status(200).json("Attendences has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }

});

module.exports = { addAttendence, getAttendence, getEmployeeAttendence, deleteAttendence };