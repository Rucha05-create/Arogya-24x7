const mongoose = require("mongoose");

// ======================================================
// REPORT SCHEMA
// ======================================================

const reportSchema = new mongoose.Schema(
    {
        // ==================================================
        // PATIENT
        // ==================================================

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ==================================================
        // DOCTOR
        // ==================================================

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null
        },


        // ==================================================
        // LABORATORY
        // ==================================================

        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab",
            default: null
        },


        // ==================================================
        // APPOINTMENT
        // ==================================================

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            default: null
        },


        // ==================================================
        // TEST INFORMATION
        // ==================================================

        testName: {
            type: String,
            required: true,
            trim: true
        },


        // ==================================================
        // REPORT TITLE
        // ==================================================

        reportTitle: {
            type: String,
            default: ""
        },


        // ==================================================
        // REPORT DATE
        // ==================================================

        reportDate: {
            type: Date,
            default: Date.now
        },


        // ==================================================
        // REPORT STATUS
        // ==================================================

        status: {
            type: String,

            enum: [
                "Pending",
                "Completed"
            ],

            default: "Pending"
        },


        // ==================================================
        // TEST RESULTS
        // ==================================================

        results: [
            {
                parameter: {
                    type: String,
                    trim: true
                },

                result: {
                    type: String,
                    trim: true
                },

                normalRange: {
                    type: String,
                    trim: true
                },

                unit: {
                    type: String,
                    default: "",
                    trim: true
                }
            }
        ],


        // ==================================================
        // DOCTOR NOTES
        // ==================================================

        doctorNotes: {
            type: String,
            default: "",
            trim: true
        },


        // ==================================================
        // LAB NOTES
        // ==================================================

        labNotes: {
            type: String,
            default: "",
            trim: true
        },


        // ==================================================
        // UPLOADED REPORT FILE
        // ==================================================

        reportFile: {
            type: String,
            default: ""
        },


        // ==================================================
        // FILE INFORMATION
        // ==================================================

        fileName: {
            type: String,
            default: ""
        },

        fileType: {
            type: String,
            default: ""
        },

        fileSize: {
            type: Number,
            default: 0
        },


        // ==================================================
        // REPORT UPLOADED BY
        // ==================================================

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },


        // ==================================================
        // REPORT DESCRIPTION
        // ==================================================

        description: {
            type: String,
            default: "",
            trim: true
        }
    },

    {
        timestamps: true
    }
);


// ======================================================
// INDEXES
// ======================================================

// Quickly find reports belonging to a patient
reportSchema.index({
    patientId: 1
});


// Quickly find reports belonging to a doctor
reportSchema.index({
    doctorId: 1
});


// Quickly find reports belonging to a laboratory
reportSchema.index({
    labId: 1
});


// Quickly find reports belonging to an appointment
reportSchema.index({
    appointmentId: 1
});


// ======================================================
// EXPORT
// ======================================================

module.exports = mongoose.model(
    "Report",
    reportSchema
);