const express = require("express");

const router = express.Router();

const {

  registerLab,

  loginLab,

  getAllLabs

} = require("../controllers/labController");

router.post("/register", registerLab);

router.post("/login", loginLab);

router.get("/", getAllLabs);

module.exports = router;