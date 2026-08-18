const mongoose = require("mongoose");


// ======================================================
// APPOINTMENT SCHEMA
// ======================================================

const appointmentSchema = new mongoose.Schema(
    {
        // ==================================================
        // PATIENT
        // ==================================================

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },


        // ==================================================
        // DOCTOR
        // ==================================================

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            default: null,
            index: true
        },


        // ==================================================
        // LABORATORY
        // ==================================================

        labId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab",
            required: true,
            index: true
        },


        // ==================================================
        // TESTS
        // ==================================================

        tests: {
            type: [
                {
                    type: String,
                    trim: true
                }
            ],
            required: true,
            validate: {
                validator: function (value) {
                    return (
                        Array.isArray(value) &&
                        value.length > 0 &&
                        value.every(
                            (test) =>
                                typeof test === "string" &&
                                test.trim() !== ""
                        )
                    );
                },
                message:
                    "At least one valid test is required"
            }
        },


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
            default: "Pending",
            index: true
        },


        // ==================================================
        // APPOINTMENT DATE
        // ==================================================

        date: {
            type: String,
            required: true,
            trim: true,
            index: true
        },


        // ==================================================
        // APPOINTMENT TIME
        // ==================================================

        time: {
            type: String,
            required: true,
            trim: true
        },


        // ==================================================
        // PAYMENT / COUPON DETAILS
        // ==================================================


        // --------------------------------------------------
        // COUPON CODE
        //
        // Example:
        // VOL15
        // EMP20
        // --------------------------------------------------

        coupon: {
            type: String,
            default: "",
            trim: true,
            uppercase: true
        },


        // --------------------------------------------------
        // DISCOUNT PERCENTAGE
        //
        // Example:
        // 20 means 20% discount
        // --------------------------------------------------

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },


        // --------------------------------------------------
        // ACTUAL DISCOUNT AMOUNT
        //
        // Example:
        //
        // Total = ₹1000
        // Discount = 20%
        // Discount Amount = ₹200
        // --------------------------------------------------

        discountAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // --------------------------------------------------
        // SPECIAL ID
        //
        // Used for:
        //
        // Volunteer ID
        // Employee ID
        // Social Worker ID
        //
        // Example:
        // VOL123
        // EMP100
        // SW200
        // --------------------------------------------------

        specialId: {
            type: String,
            default: "",
            trim: true,
            uppercase: true
        },


        // --------------------------------------------------
        // TOTAL AMOUNT BEFORE DISCOUNT
        // --------------------------------------------------

        totalAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // --------------------------------------------------
        // FINAL AMOUNT AFTER DISCOUNT
        // --------------------------------------------------

        finalAmount: {
            type: Number,
            default: 0,
            min: 0
        }
    },


    // ======================================================
    // TIMESTAMPS
    // ======================================================

    {
        timestamps: true
    }
);


// ======================================================
// INDEXES
// ======================================================
//
// These make fetching appointments faster for:
//
// Patient
// Doctor
// Laboratory
// Date
//
// ======================================================

appointmentSchema.index({
    patientId: 1,
    createdAt: -1
});


appointmentSchema.index({
    labId: 1,
    createdAt: -1
});


appointmentSchema.index({
    doctorId: 1,
    createdAt: -1
});


appointmentSchema.index({
    date: 1,
    time: 1
});


// ======================================================
// EXPORT MODEL
// ======================================================

module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);