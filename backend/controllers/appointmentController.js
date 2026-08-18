const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Lab = require("../models/Lab");
const Coupon = require("../models/Coupon");


// ======================================================
// NORMALIZE ROLE
// ======================================================

const normalizeRole = (role) => {

    const value = String(role || "")
        .toLowerCase()
        .trim()
        .replace(/-/g, "_")
        .replace(/\s+/g, "_");


    if (
        value === "health_worker" ||
        value === "healthworker" ||
        value === "sahash_employee" ||
        value === "sahashemployee" ||
        value === "employee" ||
        value === "staff"
    ) {

        return "employee";

    }


    if (
        value === "social_worker" ||
        value === "socialworker"
    ) {

        return "social_worker";

    }


    if (value === "volunteer") {

        return "volunteer";

    }


    if (
        value === "client" ||
        value === "user" ||
        value === "patient"
    ) {

        return "client";

    }


    return value;
};


// ======================================================
// BOOK APPOINTMENT
// ======================================================

const bookAppointment = async (req, res) => {

    try {

        const {
            tests,
            doctorId,
            labId,
            date,
            time,

            coupon,
            discount,
            specialId,
            totalAmount,
            discountAmount,
            finalAmount

        } = req.body;


        // ==================================================
        // CHECK AUTHENTICATION
        // ==================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        // ==================================================
        // VALIDATE TESTS
        // ==================================================

        if (
            !tests ||
            !Array.isArray(tests) ||
            tests.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Please select at least one test"

            });

        }


        // ==================================================
        // REMOVE EMPTY TESTS
        // ==================================================

        const validTests =
            tests
                .filter(
                    (test) =>
                        typeof test === "string" &&
                        test.trim() !== ""
                )
                .map(
                    (test) =>
                        test.trim()
                );


        if (
            validTests.length === 0
        ) {

            return res.status(400).json({

                message:
                    "Please select at least one valid test"

            });

        }


        // ==================================================
        // VALIDATE LAB
        // ==================================================

        if (!labId) {

            return res.status(400).json({

                message:
                    "Please select a laboratory"

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(
                labId
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid laboratory ID"

            });

        }


        // ==================================================
        // CHECK LAB EXISTS
        // ==================================================

        const lab =
            await Lab.findById(
                labId
            );


        if (!lab) {

            return res.status(404).json({

                message:
                    "Laboratory not found"

            });

        }


        // ==================================================
        // VALIDATE DATE AND TIME
        // ==================================================

        if (
            !date ||
            !time
        ) {

            return res.status(400).json({

                message:
                    "Date and time are required"

            });

        }


        // ==================================================
        // PAYMENT VARIABLES
        // ==================================================

        let appliedCoupon = null;

        let appliedDiscount = 0;

        let appliedSpecialId = "";

        let bookingTotal =
            Number(totalAmount || 0);

        let bookingDiscountAmount = 0;

        let bookingFinal = 0;


        // ==================================================
        // VALIDATE TOTAL AMOUNT
        // ==================================================

        if (
            Number.isNaN(bookingTotal) ||
            bookingTotal < 0
        ) {

            bookingTotal = 0;

        }


        // ==================================================
        // COUPON VALIDATION
        // ==================================================

        if (
            coupon &&
            String(coupon).trim() !== ""
        ) {

            // ------------------------------------------------
            // FIND COUPON
            // ------------------------------------------------

            appliedCoupon =
                await Coupon.findOne({

                    code:
                        String(coupon)
                            .trim()
                            .toUpperCase()

                });


            if (!appliedCoupon) {

                return res.status(400).json({

                    message:
                        "Invalid coupon code"

                });

            }


            // ------------------------------------------------
            // CHECK COUPON ACTIVE
            // ------------------------------------------------

            if (
                appliedCoupon.isActive === false
            ) {

                return res.status(400).json({

                    message:
                        "This coupon is currently inactive"

                });

            }


            // ------------------------------------------------
            // CHECK EXPIRY
            // ------------------------------------------------

            if (
                appliedCoupon.expiryDate &&
                new Date(
                    appliedCoupon.expiryDate
                ) < new Date()
            ) {

                return res.status(400).json({

                    message:
                        "This coupon has expired"

                });

            }


            // ------------------------------------------------
            // GET USER ROLE
            // ------------------------------------------------

            const normalizedRole =
                normalizeRole(
                    req.user.role
                );


            // ------------------------------------------------
            // COUPON ROLE
            // ------------------------------------------------

            const couponRole =
                normalizeRole(
                    appliedCoupon.allowedRole
                );


            // ------------------------------------------------
            // CHECK ROLE
            // ------------------------------------------------

            if (
                couponRole !==
                normalizedRole
            ) {

                return res.status(403).json({

                    message:
                        "This coupon is not available for your account type."

                });

            }


            // ------------------------------------------------
            // CHECK WHETHER ID IS REQUIRED
            // ------------------------------------------------

            const requiresSpecialId =
                appliedCoupon.requiresId === true ||
                [
                    "volunteer",
                    "employee",
                    "social_worker"
                ].includes(
                    normalizedRole
                );


            if (requiresSpecialId) {

                if (
                    !specialId ||
                    String(
                        specialId
                    ).trim() === ""
                ) {

                    return res.status(400).json({

                        message:
                            "Please enter your valid ID to avail this discount."

                    });

                }


                if (
                    String(
                        specialId
                    ).trim().length < 3
                ) {

                    return res.status(400).json({

                        message:
                            "Please enter a valid ID."

                    });

                }


                appliedSpecialId =
                    String(
                        specialId
                    ).trim()
                    .toUpperCase();


                // ------------------------------------------------
                // CHECK SPECIFIC ELIGIBLE ID
                // ------------------------------------------------

                if (
                    appliedCoupon.eligibleId &&
                    String(
                        appliedCoupon.eligibleId
                    ).trim() !== ""
                ) {

                    if (
                        appliedSpecialId !==
                        String(
                            appliedCoupon.eligibleId
                        )
                            .trim()
                            .toUpperCase()
                    ) {

                        return res.status(403).json({

                            message:
                                "This coupon is not valid for the entered ID."

                        });

                    }

                }

            }


            // ------------------------------------------------
            // GET DISCOUNT
            // ------------------------------------------------

            appliedDiscount =
                Number(
                    appliedCoupon.discount || 0
                );


            // ------------------------------------------------
            // SAFETY CHECK
            // ------------------------------------------------

            if (
                appliedDiscount < 0 ||
                appliedDiscount > 100
            ) {

                return res.status(400).json({

                    message:
                        "Invalid coupon discount."

                });

            }

        }


        // ==================================================
        // CALCULATE DISCOUNT
        // ==================================================

        if (
            bookingTotal > 0 &&
            appliedDiscount > 0
        ) {

            bookingDiscountAmount =
                (
                    bookingTotal *
                    appliedDiscount
                ) / 100;

        } else {

            bookingDiscountAmount = 0;

        }


        // ==================================================
        // CALCULATE FINAL AMOUNT
        // ==================================================

        bookingFinal =
            bookingTotal -
            bookingDiscountAmount;


        bookingFinal =
            Math.max(
                0,
                Number(
                    bookingFinal.toFixed(2)
                )
            );


        bookingDiscountAmount =
            Number(
                bookingDiscountAmount.toFixed(2)
            );


        // ==================================================
        // CREATE APPOINTMENT
        // ==================================================

        const appointment =
            await Appointment.create({

                patientId:
                    req.user.id,

                doctorId:
                    doctorId || null,

                labId:
                    labId,

                tests:
                    validTests,

                status:
                    "Pending",

                date:
                    date,

                time:
                    time,


                // ------------------------------------------
                // COUPON
                // ------------------------------------------

                coupon:
                    appliedCoupon
                        ? appliedCoupon.code
                        : "",


                // ------------------------------------------
                // DISCOUNT PERCENTAGE
                // ------------------------------------------

                discount:
                    appliedDiscount,


                // ------------------------------------------
                // DISCOUNT AMOUNT
                // ------------------------------------------

                discountAmount:
                    bookingDiscountAmount,


                // ------------------------------------------
                // SPECIAL ID
                // ------------------------------------------

                specialId:
                    appliedSpecialId,


                // ------------------------------------------
                // TOTAL AMOUNT
                // ------------------------------------------

                totalAmount:
                    bookingTotal,


                // ------------------------------------------
                // FINAL AMOUNT
                // ------------------------------------------

                finalAmount:
                    bookingFinal

            });


        // ==================================================
        // POPULATE PATIENT
        // ==================================================

        await appointment.populate(

            "patientId",

            "name email phone age gender bloodGroup height weight address allergies disease diseases medications emergencyContact city status"

        );


        // ==================================================
        // POPULATE DOCTOR
        // ==================================================

        await appointment.populate(

            "doctorId",

            "name email phone specialization doctorId"

        );


        // ==================================================
        // POPULATE LAB
        // ==================================================

        await appointment.populate(

            "labId",

            "labId labName location tests"

        );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({

            message:
                "Appointment booked successfully",

            appointment:
                appointment

        });

    }


    catch (err) {

        console.error(
            "Book Appointment Error:",
            err
        );

        return res.status(500).json({

            message:
                "Unable to book appointment",

            error:
                err.message

        });

    }

};


// ======================================================
// CLIENT APPOINTMENTS
// ======================================================

const getAppointments = async (req, res) => {

    try {

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                message:
                    "Authentication required"

            });

        }


        const appointments =
            await Appointment.find({

                patientId:
                    req.user.id

            })

            .populate(

                "patientId",

                "name email phone age gender bloodGroup"

            )

            .populate(

                "doctorId",

                "name email phone specialization"

            )

            .populate(

                "labId",

                "labId labName location tests"

            )

            .sort({

                createdAt:
                    -1

            });


        return res.status(200).json(

            appointments

        );

    }


    catch (err) {

        console.error(

            "Get Client Appointments Error:",

            err

        );

        return res.status(500).json({

            message:
                "Unable to fetch appointments",

            error:
                err.message

        });

    }

};


// ======================================================
// DOCTOR APPOINTMENTS
// ======================================================

const getDoctorAppointments = async (req, res) => {

    try {

        const appointments =
            await Appointment.find()

            .populate(

                "patientId",

                "name email phone age gender bloodGroup height weight address allergies disease diseases medications emergencyContact city status"

            )

            .populate(

                "doctorId",

                "name email phone specialization doctorId"

            )

            .populate(

                "labId",

                "labId labName location tests"

            )

            .sort({

                createdAt:
                    -1

            });


        console.log(

            "Doctor Appointments:",

            appointments.length

        );


        return res.status(200).json(

            appointments

        );

    }


    catch (err) {

        console.error(

            "Get Doctor Appointments Error:",

            err

        );

        return res.status(500).json({

            message:
                "Unable to fetch appointments",

            error:
                err.message

        });

    }

};


// ======================================================
// LAB APPOINTMENTS
// ======================================================
//
// Appointment.labId stores:
//
// Lab._id
//
// NOT:
//
// Lab.labId
//
// ======================================================

const getLabAppointments = async (req, res) => {

    try {

        // ==================================================
        // CHECK AUTHENTICATION
        // ==================================================

        if (
            !req.user ||
            !req.user.id
        ) {

            return res.status(401).json({

                message:
                    "Lab authentication required"

            });

        }


        console.log(

            "Logged-in Lab User:",

            req.user

        );


        // ==================================================
        // FIND LAB
        // ==================================================

        let lab = null;


        // --------------------------------------------------
        // OPTION 1
        // JWT contains MongoDB _id
        // --------------------------------------------------

        if (
            mongoose.Types.ObjectId.isValid(
                req.user.id
            )
        ) {

            lab =
                await Lab.findById(
                    req.user.id
                );

        }


        // --------------------------------------------------
        // OPTION 2
        // JWT contains custom labId
        // --------------------------------------------------

        if (!lab) {

            lab =
                await Lab.findOne({

                    labId:
                        String(
                            req.user.id
                        )

                });

        }


        // ==================================================
        // LAB NOT FOUND
        // ==================================================

        if (!lab) {

            console.error(

                "Lab not found:",

                req.user.id

            );

            return res.status(404).json({

                message:
                    "Laboratory account not found"

            });

        }


        console.log(

            "Resolved Lab:",

            {

                mongoId:
                    lab._id,

                labId:
                    lab.labId,

                labName:
                    lab.labName

            }

        );


        // ==================================================
        // FIND LAB APPOINTMENTS
        // ==================================================

        const appointments =
            await Appointment.find({

                labId:
                    lab._id

            })

            // ==================================================
            // PATIENT DETAILS
            // ==================================================

            .populate(

                "patientId",

                "name email phone age gender bloodGroup height weight address allergies disease diseases medications emergencyContact city status"

            )

            // ==================================================
            // DOCTOR DETAILS
            // ==================================================

            .populate(

                "doctorId",

                "name email phone specialization doctorId"

            )

            // ==================================================
            // LAB DETAILS
            // ==================================================

            .populate(

                "labId",

                "labId labName location tests"

            )

            // ==================================================
            // LATEST FIRST
            // ==================================================

            .sort({

                createdAt:
                    -1

            });


        console.log(

            "Lab Appointments Found:",

            appointments.length

        );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json(

            appointments

        );

    }


    catch (err) {

        console.error(

            "Get Lab Appointments Error:",

            err

        );

        return res.status(500).json({

            message:
                "Unable to fetch lab appointments",

            error:
                err.message

        });

    }

};


// ======================================================
// UPDATE APPOINTMENT STATUS
// ======================================================

const updateAppointmentStatus = async (req, res) => {

    try {

        const {
            status
        } = req.body;


        // ==================================================
        // VALIDATE STATUS
        // ==================================================

        const allowedStatuses = [

            "Pending",
            "Approved",
            "Rejected",
            "Completed"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid appointment status"

            });

        }


        // ==================================================
        // VALIDATE APPOINTMENT ID
        // ==================================================

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid appointment ID"

            });

        }


        // ==================================================
        // FIND APPOINTMENT
        // ==================================================

        const appointment =
            await Appointment.findById(

                req.params.id

            );


        if (!appointment) {

            return res.status(404).json({

                message:
                    "Appointment not found"

            });

        }


        // ==================================================
        // UPDATE STATUS
        // ==================================================

        appointment.status =
            status;


        await appointment.save();


        // ==================================================
        // POPULATE PATIENT
        // ==================================================

        await appointment.populate(

            "patientId",

            "name email phone age gender bloodGroup height weight address allergies disease diseases medications emergencyContact city status"

        );


        // ==================================================
        // POPULATE DOCTOR
        // ==================================================

        await appointment.populate(

            "doctorId",

            "name email phone specialization doctorId"

        );


        // ==================================================
        // POPULATE LAB
        // ==================================================

        await appointment.populate(

            "labId",

            "labId labName location tests"

        );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            message:
                "Appointment status updated successfully",

            appointment:
                appointment

        });

    }


    catch (err) {

        console.error(

            "Update Appointment Status Error:",

            err

        );

        return res.status(500).json({

            message:
                "Unable to update appointment",

            error:
                err.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    bookAppointment,

    getAppointments,

    getDoctorAppointments,

    getLabAppointments,

    updateAppointmentStatus

};