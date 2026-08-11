const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        },

        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab"
        },

        testName: {
            type: String,
            required: true
        },

        reportDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Completed"
            ],
            default: "Pending"
        },

        results: [
            {
                parameter: String,
                result: String,
                normalRange: String
            }
        ],

        doctorNotes: {
            type: String,
            default: ""
        },

        reportFile: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Report",
    reportSchema
);