const express = require("express");

const router = express.Router();


// ========================================
// Import Report Controllers
// ========================================

const {
    createReport,
    getReports,
    getReportById,
    updateDoctorNotes,
    updateReport,
    deleteReport
} = require("../controllers/reportController");


// ========================================
// Create New Report
// ========================================
// POST /api/reports

router.post(
    "/",
    createReport
);


// ========================================
// Get All Reports
// ========================================
// GET /api/reports

router.get(
    "/",
    getReports
);


// ========================================
// Get Single Report
// ========================================
// GET /api/reports/:id

router.get(
    "/:id",
    getReportById
);


// ========================================
// Update Doctor Notes
// ========================================
// PUT /api/reports/:id/notes

router.put(
    "/:id/notes",
    updateDoctorNotes
);


// ========================================
// Update Report
// ========================================
// PUT /api/reports/:id

router.put(
    "/:id",
    updateReport
);


// ========================================
// Delete Report
// ========================================
// DELETE /api/reports/:id

router.delete(
    "/:id",
    deleteReport
);


// ========================================
// Export Router
// ========================================

module.exports = router;