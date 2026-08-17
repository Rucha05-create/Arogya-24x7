const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");
const Lab = require("../models/Lab");

// ======================================================
// Book Appointment
// ======================================================

const bookAppointment = async (req, res) => {

    try {

        const {
            tests,
            doctorId,
            labId,
            date,
            time
        } = req.body;


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
        // VALIDATE LAB
        // ==================================================

        if (!labId) {

            return res.status(400).json({

                message:
                    "Please select a laboratory"

            });

        }


        if (
            !mongoose.Types.ObjectId.isValid(labId)
        ) {

            return res.status(400).json({

                message:
                    "Invalid laboratory ID"

            });

        }


        // ==================================================
        // VALIDATE DATE AND TIME
        // ==================================================

        if (!date || !time) {

            return res.status(400).json({

                message:
                    "Date and time are required"

            });

        }


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
                    tests,

                date:
                    date,

                time:
                    time,

                status:
                    "Pending"

            });


        // ==================================================
        // POPULATE APPOINTMENT
        // ==================================================

        await appointment.populate(
            "patientId",
            "name email phone age gender bloodGroup"
        );

        await appointment.populate(
            "doctorId",
            "name email phone specialization"
        );

        await appointment.populate(
            "labId",
            "labId labName location tests"
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(201).json({

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

        res.status(500).json({

            message:
                "Unable to book appointment",

            error:
                err.message

        });

    }

};


// ======================================================
// Client Appointments
// ======================================================

const getAppointments = async (req, res) => {

    try {

        const appointments =
            await Appointment.find({

                patientId:
                    req.user.id

            })

            .populate(
                "doctorId",
                "name email phone"
            )

            .populate(
                "labId",
                "labId labName location tests"
            )

            .sort({

                createdAt:
                    -1

            });


        res.status(200).json(

            appointments

        );

    }

    catch (err) {

        console.error(
            "Get Client Appointments Error:",
            err
        );

        res.status(500).json({

            message:
                "Unable to fetch appointments",

            error:
                err.message

        });

    }

};


// ======================================================
// Doctor Appointments
// ======================================================

const getDoctorAppointments = async (req, res) => {

    try {

        const appointments =
            await Appointment.find()

            .populate(
                "patientId",
                "name email phone age bloodGroup"
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


        console.log(
            "Doctor Appointments:",
            appointments.length
        );


        res.status(200).json(

            appointments

        );

    }

    catch (err) {

        console.error(
            "Get Doctor Appointments Error:",
            err
        );

        res.status(500).json({

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
// IMPORTANT:
//
// Appointment.labId references:
//
// Lab._id
//
// NOT:
//
// Lab.labId
//
// Therefore we first find the actual Lab document
// belonging to the logged-in laboratory.
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
        // OPTION 1:
        // req.user.id is Lab MongoDB _id
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
        // OPTION 2:
        // req.user.id is custom labId
        //
        // Example:
        //
        // req.user.id = "LAB001"
        // --------------------------------------------------

        if (!lab) {

            lab =
                await Lab.findOne({

                    labId:
                        String(req.user.id)

                });

        }


        // ==================================================
        // LAB NOT FOUND
        // ==================================================

        if (!lab) {

            console.error(
                "Lab not found for logged-in user:",
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
                mongoId: lab._id,
                labId: lab.labId,
                labName: lab.labName
            }
        );


        // ==================================================
        // FIND APPOINTMENTS
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

        res.status(200).json(

            appointments

        );

    }

    catch (err) {

        console.error(

            "Get Lab Appointments Error:",

            err

        );

        res.status(500).json({

            message:
                "Unable to fetch lab appointments",

            error:
                err.message

        });

    }

};


// ======================================================
// Update Appointment Status
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
            !allowedStatuses.includes(status)
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
        // POPULATE UPDATED APPOINTMENT
        // ==================================================

        await appointment.populate(

            "patientId",

            "name email phone age bloodGroup"

        );

        await appointment.populate(

            "doctorId",

            "name email phone specialization"

        );

        await appointment.populate(

            "labId",

            "labId labName location tests"

        );


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

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

        res.status(500).json({

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