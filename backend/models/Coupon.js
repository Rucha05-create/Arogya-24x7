const mongoose = require("mongoose");


// ======================================================
// COUPON SCHEMA
// ======================================================

const couponSchema = new mongoose.Schema(
    {

        // ==================================================
        // COUPON CODE
        // ==================================================

        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },


        // ==================================================
        // DISCOUNT PERCENTAGE
        //
        // Example:
        //
        // 10 = 10% discount
        // 15 = 15% discount
        // 20 = 20% discount
        // 25 = 25% discount
        // ==================================================

        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },


        // ==================================================
        // WHO CAN USE THIS COUPON
        //
        // client
        // volunteer
        // employee
        // social_worker
        // ==================================================

        allowedRole: {
            type: String,
            required: true,

            enum: [
                "client",
                "volunteer",
                "employee",
                "social_worker"
            ],

            lowercase: true,
            trim: true
        },


        // ==================================================
        // WHETHER ID IS REQUIRED
        //
        // Client:
        // false
        //
        // Volunteer:
        // true
        //
        // Employee:
        // true
        //
        // Social Worker:
        // true
        // ==================================================

        requiresId: {
            type: Boolean,
            default: false
        },


        // ==================================================
        // ID TYPE
        //
        // volunteer:
        // volunteer_id
        //
        // employee:
        // employee_id
        //
        // social_worker:
        // social_worker_id
        //
        // client:
        // null
        // ==================================================

        idType: {
            type: String,

            enum: [
                "volunteer_id",
                "employee_id",
                "social_worker_id",
                null
            ],

            default: null,

            trim: true,
            lowercase: true
        },


        // ==================================================
        // SPECIFIC ELIGIBLE ID
        //
        // This field is OPTIONAL.
        //
        // If empty:
        //
        // Any valid ID belonging to the allowed role
        // can use the coupon.
        //
        // If provided:
        //
        // Only that specific ID can use the coupon.
        //
        // Examples:
        //
        // VOL12345
        // EMP1001
        // SW2001
        // ==================================================

        eligibleId: {
            type: String,

            default: "",

            trim: true,

            uppercase: true
        },


        // ==================================================
        // ACTIVE / INACTIVE
        //
        // true:
        // Coupon can be used.
        //
        // false:
        // Coupon cannot be used.
        // ==================================================

        isActive: {
            type: Boolean,
            default: true
        },


        // ==================================================
        // EXPIRY DATE
        //
        // null:
        // No expiry.
        //
        // Date:
        // Coupon expires on this date.
        // ==================================================

        expiryDate: {
            type: Date,
            default: null
        }

    },

    {
        timestamps: true
    }
);


// ======================================================
// VALIDATION
// ======================================================
//
// Automatically make ID requirement consistent with role.
//
// Client:
// requiresId = false
// idType = null
//
// Volunteer:
// requiresId = true
// idType = volunteer_id
//
// Employee:
// requiresId = true
// idType = employee_id
//
// Social Worker:
// requiresId = true
// idType = social_worker_id
// ======================================================

couponSchema.pre(
    "validate",
    function (next) {

        // --------------------------------------------------
        // CLIENT
        // --------------------------------------------------

        if (
            this.allowedRole === "client"
        ) {

            this.requiresId = false;

            this.idType = null;

            this.eligibleId = "";

        }


        // --------------------------------------------------
        // VOLUNTEER
        // --------------------------------------------------

        else if (
            this.allowedRole === "volunteer"
        ) {

            this.requiresId = true;

            if (
                !this.idType
            ) {

                this.idType =
                    "volunteer_id";

            }

        }


        // --------------------------------------------------
        // EMPLOYEE
        // --------------------------------------------------

        else if (
            this.allowedRole === "employee"
        ) {

            this.requiresId = true;

            if (
                !this.idType
            ) {

                this.idType =
                    "employee_id";

            }

        }


        // --------------------------------------------------
        // SOCIAL WORKER
        // --------------------------------------------------

        else if (
            this.allowedRole === "social_worker"
        ) {

            this.requiresId = true;

            if (
                !this.idType
            ) {

                this.idType =
                    "social_worker_id";

            }

        }


        next();

    }
);


// ======================================================
// COUPON MODEL
// ======================================================

module.exports = mongoose.model(
    "Coupon",
    couponSchema
);