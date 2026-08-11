const express = require("express");

const router = express.Router();

const {
    registerDoctor,
    loginDoctor,
    getDoctors,
    getPatients,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");


// ==========================
// Register Doctor
// ==========================

router.post(
    "/register",
    registerDoctor
);


// ==========================
// Doctor Login
// ==========================

router.post(
    "/login",
    loginDoctor
);


// ==========================
// Get All Doctors
// ==========================

router.get(
    "/",
    getDoctors
);


// ==========================
// Get All Registered Patients
// ==========================

router.get(
    "/patients",
    getPatients
);


// ==========================
// Update Doctor
// ==========================

router.put(
    "/:id",
    updateDoctor
);


// ==========================
// Delete Doctor
// ==========================

router.delete(
    "/:id",
    deleteDoctor
);


// ==========================
// Export Router
// ==========================

module.exports = router;