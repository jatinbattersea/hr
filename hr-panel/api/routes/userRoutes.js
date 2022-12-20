const express = require("express");
const {
    addMember,
    getMembers,
    getUser,
    updateUser,
    deleteUser,
    getUserSpecificData,
    uploadFile,
    changePassword,
} = require("../controllers/userControllers");
const { upload } = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/addMember", addMember);
router.post("/upload", upload.single('file'), uploadFile);
router.get("/", getMembers);
router.get("/:employeeID", getUser);
router.put("/:id", updateUser);
router.get("/employee/shifts", getUserSpecificData); 
router.delete("/:id", deleteUser);
router.put("/accounts/settings/forget-password", changePassword);

module.exports = router;