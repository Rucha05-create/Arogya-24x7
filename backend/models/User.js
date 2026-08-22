const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // =====================================================
        // BASIC USER INFORMATION
        // =====================================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            default: "",
            trim: true
        },

        age: {
            type: Number,
            default: null
        },

        gender: {
            type: String,
            default: ""
        },


        // =====================================================
        // HEALTH INFORMATION
        // =====================================================

        bloodGroup: {
            type: String,
            default: ""
        },

        height: {
            type: String,
            default: ""
        },

        weight: {
            type: String,
            default: ""
        },

        allergies: {
            type: String,
            default: ""
        },

        diseases: {
            type: String,
            default: ""
        },

        medications: {
            type: String,
            default: ""
        },

        emergencyContact: {
            type: String,
            default: ""
        },


        // =====================================================
        // ADDRESS INFORMATION
        // =====================================================

        address: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },


        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        status: {
            type: String,
            enum: [
                "Active",
                "Inactive",
                "Blocked"
            ],
            default: "Active"
        },


        // =====================================================
        // USER ROLE / ACCOUNT TYPE
        // =====================================================
        //
        // These roles must match the roles used by your
        // registration/login system and coupon collection.
        //
        // Supported account types:
        //
        // client
        // health_worker
        // intern
        // volunteer
        // social_worker
        // employee
        // sahash_employee
        // doctor
        // lab
        // admin
        //
        // =====================================================

        role: {
            type: String,

            enum: [
                "client",
                "admin",
                "doctor",
                "lab",

                "health_worker",
                "intern",
                "volunteer",

                "social_worker",
                "employee",
                "sahash_employee"
            ],

            default: "client"
        }
    },

    {
        timestamps: true
    }
);


// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = mongoose.model(
    "User",
    userSchema
);

