const express = require("express");

const router = express.Router();

const {
    getAllUsers,
    updateUser
} = require("../controllers/userController");

// Get all users
router.get("/", getAllUsers);

// Update user profile
router.put("/:id", updateUser);

module.exports = router;