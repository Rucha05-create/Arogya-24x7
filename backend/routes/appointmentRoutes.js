const express = require("express");

const router = express.Router();


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const protect = require("../middleware/authMiddleware");


// ======================================================
// CONTROLLER FUNCTIONS
// ======================================================

const {
    bookAppointment,
    getAppointments,
    getDoctorAppointments,
    getLabAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");


// ======================================================
// CLIENT ROUTES
// ======================================================


// ------------------------------------------------------
// Book Appointment
// POST /api/appointments/book
// ------------------------------------------------------

router.post(
    "/book",
    protect,
    bookAppointment
);


// ------------------------------------------------------
// Get Logged-in Client's Appointments
// GET /api/appointments/my
// ------------------------------------------------------

router.get(
    "/my",
    protect,
    getAppointments
);


// ======================================================
// DOCTOR ROUTES
// ======================================================


// ------------------------------------------------------
// Get Doctor Appointments
// GET /api/appointments/doctor
// ------------------------------------------------------

router.get(
    "/doctor",
    protect,
    getDoctorAppointments
);


// ======================================================
// LAB ROUTES
// ======================================================


// ------------------------------------------------------
// Get Logged-in Lab's Appointments
// GET /api/appointments/lab
// ------------------------------------------------------
//
// IMPORTANT:
// The authentication middleware gets the logged-in
// laboratory from the JWT token.
//
// req.user.id = logged-in lab's MongoDB _id
//
// The controller then finds appointments where:
//
// appointment.labId === req.user.id
//
// ------------------------------------------------------

router.get(
    "/lab",
    protect,
    getLabAppointments
);


// ======================================================
// UPDATE APPOINTMENT STATUS
// ======================================================


// ------------------------------------------------------
// Update Appointment Status
//
// PUT /api/appointments/:id
//
// Example body:
//
// {
//     "status": "Approved"
// }
//
// Other supported statuses:
//
// Pending
// Approved
// Rejected
// Completed
//
// ------------------------------------------------------

router.put(
    "/:id",
    protect,
    updateAppointmentStatus
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;