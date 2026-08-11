const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    bookAppointment,
    getAppointments,
    getDoctorAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");


// ==========================
// CLIENT
// ==========================

// Book appointment
router.post(
    "/book",
    protect,
    bookAppointment
);


// Get logged-in client's appointments
router.get(
    "/my",
    protect,
    getAppointments
);


// ==========================
// DOCTOR
// ==========================

// Get appointments for doctor
router.get(
    "/doctor",
    protect,
    getDoctorAppointments
);


// Approve / Reject appointment
router.put(
    "/:id",
    protect,
    updateAppointmentStatus
);


module.exports = router;