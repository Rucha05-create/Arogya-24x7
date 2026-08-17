const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
            required: true
        },

        // ==================================================
        // TESTS
        // ==================================================

        tests: [
            {
                type: String,
                trim: true
            }
        ],

        // ==================================================
        // APPOINTMENT STATUS
        // ==================================================

        status: {
            type: String,
            enum: [
                "Pending",
                "Approved",
                "Rejected",
                "Completed"
            ],
            default: "Pending"
        },

        // ==================================================
        // APPOINTMENT DATE
        // ==================================================

        date: {
            type: String,
            required: true
        },

        // ==================================================
        // APPOINTMENT TIME
        // ==================================================

        time: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);