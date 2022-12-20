const mongoose = require("mongoose");
const { ShiftSchema } = require("./shiftModel");

const employeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
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
        dob: {
            type: String,
            required: true,
        },
        doj: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
        },
        designation: {
            type: String,
            required: true,
        },
        team: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            max: 70,
        },
        bankName: {
            type: String,
        },
        accNo: {
            type: String,
        },
        ifsc: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },
        shift: {
            type: ShiftSchema,
        }
    },
    {
        timeStamps: true,
    }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;