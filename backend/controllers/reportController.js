const mongoose = require("mongoose");

const Report = require("../models/Report");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

// ========================================
// Helper: Populate Report Information
// ========================================

const populateReport = (query) => {
    return query
        .populate(
            "patientId",
            "name email phone age gender bloodGroup height weight allergies diseases medications emergencyContact address city status"
        )
        .populate(
            "doctorId",
            "name doctorId specialization"
        );
};

// ========================================
// Create Report
// ========================================

const createReport = async (req, res) => {

    try {

        const {
            patientId,
            doctorId,
            appointmentId,
            labId,
            testName,
            reportDate,
            status,
            results,
            reportFile,
            doctorNotes
        } = req.body;


        // ========================================
        // Validate Patient ID
        // ========================================

        if (!patientId) {

            return res.status(400).json({

                message: "Patient ID is required"

            });

        }


        if (!mongoose.Types.ObjectId.isValid(patientId)) {

            return res.status(400).json({

                message: "Invalid Patient ID"

            });

        }


        // ========================================
        // Validate Test Name
        // ========================================

        if (!testName || testName.trim() === "") {

            return res.status(400).json({

                message: "Test Name is required"

            });

        }


        // ========================================
        // Check Patient Exists
        // ========================================

        const patient = await User.findById(patientId);

        if (!patient) {

            return res.status(404).json({

                message: "Patient not found"

            });

        }


        // ========================================
        // Validate Doctor ID If Provided
        // ========================================

        if (
            doctorId &&
            !mongoose.Types.ObjectId.isValid(doctorId)
        ) {

            return res.status(400).json({

                message: "Invalid Doctor ID"

            });

        }


        // ========================================
        // Check Doctor Exists If Provided
        // ========================================

        if (doctorId) {

            const doctor = await Doctor.findById(
                doctorId
            );

            if (!doctor) {

                return res.status(404).json({

                    message: "Doctor not found"

                });

            }

        }


        // ========================================
        // Build Report Data
        // ========================================

        const reportData = {

            patientId,

            testName: testName.trim(),

            status:
                status || "Pending",

            results:
                Array.isArray(results)
                    ? results
                    : [],

            reportDate:
                reportDate || new Date(),

            reportFile:
                reportFile || "",

            doctorNotes:
                doctorNotes || ""

        };


        // ========================================
        // Add Doctor Only If Available
        // ========================================

        if (doctorId) {

            reportData.doctorId = doctorId;

        }


        // ========================================
        // Add Appointment Only If Valid
        // ========================================

        if (
            appointmentId &&
            mongoose.Types.ObjectId.isValid(
                appointmentId
            )
        ) {

            reportData.appointmentId =
                appointmentId;

        }


        // ========================================
        // Add Lab Only If Valid
        // ========================================

        if (
            labId &&
            mongoose.Types.ObjectId.isValid(labId)
        ) {

            reportData.labId = labId;

        }


        // ========================================
        // Create Report
        // ========================================

        const report = await Report.create(
            reportData
        );


        // ========================================
        // Get Populated Report
        // ========================================

        const populatedReport =
            await populateReport(
                Report.findById(report._id)
            );


        console.log(
            "Report Created:",
            populatedReport
        );


        // ========================================
        // Response
        // ========================================

        res.status(201).json({

            message:
                "Report Created Successfully",

            report:
                populatedReport

        });

    }

    catch (error) {

        console.error(
            "Create Report Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to create report",

            error:
                error.message

        });

    }

};


// ========================================
// Get All Reports
// ========================================

const getReports = async (req, res) => {

    try {

        // ========================================
        // Fetch Reports
        // ========================================

        const reports =
            await populateReport(

                Report.find({})

                    .sort({
                        createdAt: -1
                    })

            );


        console.log(
            "Reports Found:",
            reports.length
        );


        // ========================================
        // Return Reports
        // ========================================

        res.status(200).json(

            reports

        );

    }

    catch (error) {

        console.error(
            "Get Reports Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to fetch reports",

            error:
                error.message

        });

    }

};


// ========================================
// Get Report By ID
// ========================================

const getReportById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // ========================================
        // Validate Report ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    "Invalid Report ID"

            });

        }


        // ========================================
        // Find Report
        // ========================================

        const report =
            await populateReport(

                Report.findById(id)

            );


        // ========================================
        // Report Not Found
        // ========================================

        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        // ========================================
        // Return Report
        // ========================================

        res.status(200).json(

            report

        );

    }

    catch (error) {

        console.error(
            "Get Report By ID Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to fetch report",

            error:
                error.message

        });

    }

};


// ========================================
// Update Doctor Notes
// ========================================

const updateDoctorNotes = async (req, res) => {

    try {

        const {
            doctorNotes
        } = req.body;


        // ========================================
        // Validate Report ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Report ID"

            });

        }


        // ========================================
        // Update Notes
        // ========================================

        const report =
            await Report.findByIdAndUpdate(

                req.params.id,

                {

                    doctorNotes:
                        doctorNotes || ""

                },

                {

                    new: true,
                    runValidators: true

                }

            );


        // ========================================
        // Report Not Found
        // ========================================

        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        // ========================================
        // Populate Updated Report
        // ========================================

        const populatedReport =
            await populateReport(

                Report.findById(
                    report._id
                )

            );


        // ========================================
        // Response
        // ========================================

        res.status(200).json({

            message:
                "Doctor Notes Updated Successfully",

            report:
                populatedReport

        });

    }

    catch (error) {

        console.error(
            "Update Doctor Notes Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to update doctor notes",

            error:
                error.message

        });

    }

};


// ========================================
// Update Report
// ========================================

const updateReport = async (req, res) => {

    try {

        const {
            testName,
            status,
            results,
            reportDate,
            reportFile,
            doctorNotes
        } = req.body;


        // ========================================
        // Validate Report ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Report ID"

            });

        }


        // ========================================
        // Build Update Object
        // ========================================

        const updateData = {};


        if (
            testName !== undefined &&
            testName.trim() !== ""
        ) {

            updateData.testName =
                testName.trim();

        }


        if (
            status !== undefined
        ) {

            updateData.status =
                status;

        }


        if (
            results !== undefined
        ) {

            updateData.results =
                Array.isArray(results)
                    ? results
                    : [];

        }


        if (
            reportDate !== undefined
        ) {

            updateData.reportDate =
                reportDate;

        }


        if (
            reportFile !== undefined
        ) {

            updateData.reportFile =
                reportFile;

        }


        if (
            doctorNotes !== undefined
        ) {

            updateData.doctorNotes =
                doctorNotes;

        }


        // ========================================
        // Update Report
        // ========================================

        const report =
            await Report.findByIdAndUpdate(

                req.params.id,

                updateData,

                {

                    new: true,
                    runValidators: true

                }

            );


        // ========================================
        // Report Not Found
        // ========================================

        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        // ========================================
        // Populate Updated Report
        // ========================================

        const populatedReport =
            await populateReport(

                Report.findById(
                    report._id
                )

            );


        // ========================================
        // Response
        // ========================================

        res.status(200).json({

            message:
                "Report Updated Successfully",

            report:
                populatedReport

        });

    }

    catch (error) {

        console.error(
            "Update Report Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to update report",

            error:
                error.message

        });

    }

};


// ========================================
// Delete Report
// ========================================

const deleteReport = async (req, res) => {

    try {

        // ========================================
        // Validate Report ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Report ID"

            });

        }


        // ========================================
        // Delete Report
        // ========================================

        const report =
            await Report.findByIdAndDelete(

                req.params.id

            );


        // ========================================
        // Report Not Found
        // ========================================

        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        // ========================================
        // Response
        // ========================================

        res.status(200).json({

            message:
                "Report Deleted Successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Report Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to delete report",

            error:
                error.message

        });

    }

};


// ========================================
// Export Controllers
// ========================================

module.exports = {

    createReport,

    getReports,

    getReportById,

    updateDoctorNotes,

    updateReport,

    deleteReport

};