const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
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

        status: {
            type: String,
            default: "Active"
        },

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
                "sahash_employee"
            ],

            default: "client"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);