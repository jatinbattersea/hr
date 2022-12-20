const express = require("express");
const {
    getShifts,
    getShift,
    addShift,
    updateShift,
    deleteShift,
} = require("../controllers/shiftControllers");
const router = express.Router();

router.get("/", getShifts);
router.get("/:name", getShift);
router.post("/addShift", addShift);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);

module.exports = router;