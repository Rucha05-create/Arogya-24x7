const Appointment = require("../models/Appointment");
const User = require("../models/User");

// ==========================
// Book Appointment
// ==========================

const bookAppointment = async (req, res) => {

    try {

        const {
            tests,
            doctorId,
            labId,
            date,
            time
        } = req.body;

        const appointment = await Appointment.create({

            patientId: req.user.id,

            doctorId,

            labId,

            tests,

            date,

            time,

            status: "Pending"

        });

        res.status(201).json(appointment);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// ==========================
// Client Appointments
// ==========================

const getAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find({

            patientId: req.user.id

        })
        .populate("doctorId")
        .populate("labId");

        res.json(appointments);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// ==========================
// Doctor Appointments
// ==========================

const getDoctorAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find()

            .populate(
                "patientId",
                "name email phone age bloodGroup"
            )

            .populate(
                "doctorId",
                "name email"
            )

            .populate(
                "labId"
            )

            .sort({
                createdAt: -1
            });


        console.log(
            "Doctor Appointments:",
            appointments
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

// ==========================
// Update Status
// ==========================

const updateAppointmentStatus = async (req, res) => {

    try {

        const appointment = await Appointment.findByIdAndUpdate(

            req.params.id,

            {

                status: req.body.status

            },

            {

                new: true

            }

        );

        res.json(appointment);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

module.exports = {

    bookAppointment,

    getAppointments,

    getDoctorAppointments,

    updateAppointmentStatus

};