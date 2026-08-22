const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ======================================================
        // BASIC INFORMATION
        // ======================================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            default: ""
        },

        age: {
            type: Number,
            default: null
        },

        gender: {
            type: String,
            default: ""
        },

        // ======================================================
        // MEDICAL INFORMATION
        // ======================================================

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

        address: {
            type: String,
            default: ""
        },

        city: {
            type: String,
            default: ""
        },

        // ======================================================
        // SPECIAL ROLE ID
        // ======================================================
        //
        // Examples:
        //
        // Volunteer      → VOL123
        // Employee       → EMP123
        // Social Worker  → SW123
        // Intern         → INT123
        // Health Worker  → HW123
        //
        // Client normally does not need a roleId.
        //
        // ======================================================

        roleId: {
            type: String,
            default: "",
            trim: true,
            uppercase: true
        },

        // ======================================================
        // STATUS
        // ======================================================

        status: {
            type: String,
            default: "Active"
        },

        // ======================================================
        // USER ROLE
        // ======================================================

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
                "sahash_employee",
                "employee",
                "social_worker"
            ],

            default: "client"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "User",
    userSchema
);