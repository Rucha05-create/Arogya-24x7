const mongoose = require("mongoose");

const Report = require("../models/Report");
const User = require("../models/User");
const Doctor = require("../models/Doctor");

// ======================================================
// HELPER: PARSE RESULTS
// ======================================================

const parseResults = (results) => {
    if (!results) {
        return [];
    }

    // If already an array
    if (Array.isArray(results)) {
        return results;
    }

    // If sent as JSON string through FormData
    if (typeof results === "string") {
        try {
            const parsed = JSON.parse(results);

            return Array.isArray(parsed)
                ? parsed
                : [];
        } catch (error) {
            return [];
        }
    }

    return [];
};


// ======================================================
// HELPER: POPULATE REPORT
// ======================================================

const populateReport = (query) => {

    return query

        // Patient
        .populate(
            "patientId",
            "name email phone age gender bloodGroup height weight allergies diseases medications emergencyContact address city status"
        )

        // Doctor
        .populate(
            "doctorId",
            "name email doctorId specialization phone"
        )

        // Laboratory
        .populate(
            "labId"
        )

        // Appointment
        .populate(
            "appointmentId"
        );
};


// ======================================================
// CREATE REPORT
// ======================================================

const createReport = async (req, res) => {

    try {

        const {
            patientId,
            doctorId,
            appointmentId,
            labId,
            testName,
            reportTitle,
            reportDate,
            status,
            results,
            reportFile,
            doctorNotes,
            labNotes,
            description
        } = req.body;


        // ==================================================
        // PATIENT ID
        // ==================================================

        if (!patientId) {

            return res.status(400).json({
                message: "Patient ID is required"
            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                patientId
            )
        ) {

            return res.status(400).json({
                message: "Invalid Patient ID"
            });

        }


        // ==================================================
        // CHECK PATIENT
        // ==================================================

        const patient =
            await User.findById(patientId);

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }


        // ==================================================
        // TEST NAME
        // ==================================================

        if (
            !testName ||
            testName.trim() === ""
        ) {

            return res.status(400).json({
                message: "Test Name is required"
            });

        }


        // ==================================================
        // DOCTOR VALIDATION
        // ==================================================

        if (
            doctorId &&
            !mongoose.Types.ObjectId.isValid(
                doctorId
            )
        ) {

            return res.status(400).json({
                message: "Invalid Doctor ID"
            });

        }


        if (doctorId) {

            const doctor =
                await Doctor.findById(
                    doctorId
                );

            if (!doctor) {

                return res.status(404).json({
                    message: "Doctor not found"
                });

            }

        }


        // ==================================================
        // APPOINTMENT VALIDATION
        // ==================================================

        if (
            appointmentId &&
            !mongoose.Types.ObjectId.isValid(
                appointmentId
            )
        ) {

            return res.status(400).json({
                message: "Invalid Appointment ID"
            });

        }


        // ==================================================
        // LAB VALIDATION
        // ==================================================

        if (
            labId &&
            !mongoose.Types.ObjectId.isValid(
                labId
            )
        ) {

            return res.status(400).json({
                message: "Invalid Lab ID"
            });

        }


        // ==================================================
        // HANDLE UPLOADED FILE
        // ==================================================

        let uploadedFilePath = "";


        if (req.file) {

            uploadedFilePath =
                `/uploads/reports/${req.file.filename}`;

        }


        // If a file was not uploaded but a path
        // was manually provided
        if (
            !uploadedFilePath &&
            reportFile
        ) {

            uploadedFilePath =
                reportFile;

        }


        // ==================================================
        // BUILD REPORT DATA
        // ==================================================

        const reportData = {

            patientId,

            testName:
                testName.trim(),

            reportTitle:
                reportTitle ||
                testName.trim(),

            reportDate:
                reportDate ||
                new Date(),

            status:
                status || "Pending",

            results:
                parseResults(results),

            reportFile:
                uploadedFilePath,

            doctorNotes:
                doctorNotes || "",

            labNotes:
                labNotes || "",

            description:
                description || "",

            fileName:
                req.file
                    ? req.file.originalname
                    : "",

            fileType:
                req.file
                    ? req.file.mimetype
                    : "",

            fileSize:
                req.file
                    ? req.file.size
                    : 0
        };


        // ==================================================
        // ADD DOCTOR
        // ==================================================

        if (doctorId) {

            reportData.doctorId =
                doctorId;

        }


        // ==================================================
        // ADD APPOINTMENT
        // ==================================================

        if (appointmentId) {

            reportData.appointmentId =
                appointmentId;

        }


        // ==================================================
        // ADD LAB
        // ==================================================

        if (labId) {

            reportData.labId =
                labId;

        }


        // ==================================================
        // UPLOADED BY
        // ==================================================

        if (
            req.user &&
            req.user.id &&
            mongoose.Types.ObjectId.isValid(
                req.user.id
            )
        ) {

            reportData.uploadedBy =
                req.user.id;

        }


        // ==================================================
        // CREATE REPORT
        // ==================================================

        const report =
            await Report.create(
                reportData
            );


        // ==================================================
        // GET POPULATED REPORT
        // ==================================================

        const populatedReport =
            await populateReport(
                Report.findById(
                    report._id
                )
            );


        console.log(
            "Report Created:",
            report._id
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({

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

        return res.status(500).json({

            message:
                "Unable to create report",

            error:
                error.message

        });

    }

};


// ======================================================
// GET ALL REPORTS
// ======================================================

const getReports = async (req, res) => {

    try {

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


        return res.status(200).json(
            reports
        );

    }

    catch (error) {

        console.error(
            "Get Reports Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch reports",

            error:
                error.message

        });

    }

};


// ======================================================
// GET REPORT BY ID
// ======================================================

const getReportById = async (req, res) => {

    try {

        const { id } =
            req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    "Invalid Report ID"

            });

        }


        const report =
            await populateReport(

                Report.findById(id)

            );


        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        return res.status(200).json(
            report
        );

    }

    catch (error) {

        console.error(
            "Get Report By ID Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch report",

            error:
                error.message

        });

    }

};


// ======================================================
// GET PATIENT REPORTS
// ======================================================

const getPatientReports = async (req, res) => {

    try {

        const patientId =
            req.params.patientId ||
            req.user?.id;


        if (!patientId) {

            return res.status(400).json({

                message:
                    "Patient ID is required"

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                patientId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Patient ID"

            });

        }


        const reports =
            await populateReport(

                Report.find({
                    patientId
                })
                .sort({
                    reportDate: -1,
                    createdAt: -1
                })

            );


        return res.status(200).json(
            reports
        );

    }

    catch (error) {

        console.error(
            "Get Patient Reports Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch patient reports",

            error:
                error.message

        });

    }

};


// ======================================================
// GET DOCTOR REPORTS
// ======================================================

const getDoctorReports = async (req, res) => {

    try {

        const doctorId =
            req.params.doctorId ||
            req.user?.id;


        if (!doctorId) {

            return res.status(400).json({

                message:
                    "Doctor ID is required"

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                doctorId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Doctor ID"

            });

        }


        const reports =
            await populateReport(

                Report.find({
                    doctorId
                })
                .sort({
                    reportDate: -1,
                    createdAt: -1
                })

            );


        return res.status(200).json(
            reports
        );

    }

    catch (error) {

        console.error(
            "Get Doctor Reports Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch doctor reports",

            error:
                error.message

        });

    }

};


// ======================================================
// GET LAB REPORTS
// ======================================================

const getLabReports = async (req, res) => {

    try {

        const labId =
            req.params.labId ||
            req.user?.id;


        if (!labId) {

            return res.status(400).json({

                message:
                    "Lab ID is required"

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                labId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid Lab ID"

            });

        }


        const reports =
            await populateReport(

                Report.find({
                    labId
                })
                .sort({
                    reportDate: -1,
                    createdAt: -1
                })

            );


        return res.status(200).json(
            reports
        );

    }

    catch (error) {

        console.error(
            "Get Lab Reports Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch laboratory reports",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE DOCTOR NOTES
// ======================================================

const updateDoctorNotes = async (req, res) => {

    try {

        const {
            doctorNotes
        } = req.body;


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


        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        const populatedReport =
            await populateReport(

                Report.findById(
                    report._id
                )

            );


        return res.status(200).json({

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

        return res.status(500).json({

            message:
                "Unable to update doctor notes",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE REPORT
// ======================================================

const updateReport = async (req, res) => {

    try {

        const {
            testName,
            reportTitle,
            status,
            results,
            reportDate,
            reportFile,
            doctorNotes,
            labNotes,
            description
        } = req.body;


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


        const updateData = {};


        // ==================================================
        // TEST NAME
        // ==================================================

        if (
            testName !== undefined &&
            testName.trim() !== ""
        ) {

            updateData.testName =
                testName.trim();

        }


        // ==================================================
        // REPORT TITLE
        // ==================================================

        if (
            reportTitle !== undefined
        ) {

            updateData.reportTitle =
                reportTitle;

        }


        // ==================================================
        // STATUS
        // ==================================================

        if (
            status !== undefined
        ) {

            updateData.status =
                status;

        }


        // ==================================================
        // RESULTS
        // ==================================================

        if (
            results !== undefined
        ) {

            updateData.results =
                parseResults(results);

        }


        // ==================================================
        // REPORT DATE
        // ==================================================

        if (
            reportDate !== undefined
        ) {

            updateData.reportDate =
                reportDate;

        }


        // ==================================================
        // DOCTOR NOTES
        // ==================================================

        if (
            doctorNotes !== undefined
        ) {

            updateData.doctorNotes =
                doctorNotes;

        }


        // ==================================================
        // LAB NOTES
        // ==================================================

        if (
            labNotes !== undefined
        ) {

            updateData.labNotes =
                labNotes;

        }


        // ==================================================
        // DESCRIPTION
        // ==================================================

        if (
            description !== undefined
        ) {

            updateData.description =
                description;

        }


        // ==================================================
        // FILE UPDATE
        // ==================================================

        if (req.file) {

            updateData.reportFile =
                `/uploads/reports/${req.file.filename}`;

            updateData.fileName =
                req.file.originalname;

            updateData.fileType =
                req.file.mimetype;

            updateData.fileSize =
                req.file.size;

        }
        else if (
            reportFile !== undefined
        ) {

            updateData.reportFile =
                reportFile;

        }


        // ==================================================
        // UPDATE
        // ==================================================

        const report =
            await Report.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        // ==================================================
        // POPULATE
        // ==================================================

        const populatedReport =
            await populateReport(

                Report.findById(
                    report._id
                )

            );


        return res.status(200).json({

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

        return res.status(500).json({

            message:
                "Unable to update report",

            error:
                error.message

        });

    }

};


// ======================================================
// DELETE REPORT
// ======================================================

const deleteReport = async (req, res) => {

    try {

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


        const report =
            await Report.findByIdAndDelete(
                req.params.id
            );


        if (!report) {

            return res.status(404).json({

                message:
                    "Report not found"

            });

        }


        return res.status(200).json({

            message:
                "Report Deleted Successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Report Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to delete report",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createReport,

    getReports,

    getReportById,

    getPatientReports,

    getDoctorReports,

    getLabReports,

    updateDoctorNotes,

    updateReport,

    deleteReport

};