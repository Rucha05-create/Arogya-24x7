const Doctor = require("../models/Doctor");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ========================================
// Generate JWT Token
// ========================================

const generateToken = (id, role) => {

    return jwt.sign(

        {
            id,
            role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "7d"
        }

    );

};


// ========================================
// Register Doctor
// ========================================

const registerDoctor = async (req, res) => {

    try {

        const {
            doctorId,
            password,
            name,
            specialization
        } = req.body;


        // Check if doctor already exists

        const existingDoctor = await Doctor.findOne({
            doctorId
        });


        if (existingDoctor) {

            return res.status(400).json({

                message: "Doctor already exists"

            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create doctor

        const doctor = await Doctor.create({

            doctorId,
            password: hashedPassword,
            name,
            specialization

        });


        res.status(201).json({

            message: "Doctor Registered Successfully",

            doctor

        });

    }

    catch (error) {

        console.error(
            "Register Doctor Error:",
            error
        );


        res.status(500).json({

            message: error.message

        });

    }

};


// ========================================
// Login Doctor
// ========================================

const loginDoctor = async (req, res) => {

    try {

        const {
            doctorId,
            password
        } = req.body;


        // Find doctor

        const doctor = await Doctor.findOne({
            doctorId
        });


        if (!doctor) {

            return res.status(404).json({

                message: "Doctor not found"

            });

        }


        // Check password

        const isMatch = await bcrypt.compare(

            password,
            doctor.password

        );


        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid Password"

            });

        }


        // Send login response

        res.json({

            message: "Doctor Login Successful",

            token: generateToken(

                doctor._id,
                "doctor"

            ),

            doctor: {

                id: doctor._id,

                doctorId:
                    doctor.doctorId,

                name:
                    doctor.name,

                specialization:
                    doctor.specialization

            }

        });

    }

    catch (error) {

        console.error(
            "Doctor Login Error:",
            error
        );


        res.status(500).json({

            message: error.message

        });

    }

};


// ========================================
// Get All Doctors
// ========================================

const getDoctors = async (req, res) => {

    try {

        const doctors = await Doctor
            .find()
            .select("-password")
            .sort({
                createdAt: -1
            });


        res.status(200).json(
            doctors
        );

    }

    catch (error) {

        console.error(
            "Get Doctors Error:",
            error
        );


        res.status(500).json({

            message:
                "Unable to fetch doctors",

            error:
                error.message

        });

    }

};


// ========================================
// Get All Registered Patients
// ========================================

// ==========================
// Get All Registered Patients
// ==========================

const getPatients = async (req, res) => {

    try {

        // Get all registered users
        // Do NOT filter by role because existing
        // users may not have a role field.

        const patients = await User
            .find({})
            .select("-password")
            .sort({ createdAt: -1 });

        console.log(
            "Registered Patients:",
            patients
        );

        res.status(200).json(patients);

    }

    catch (error) {

        console.error(
            "Get Patients Error:",
            error
        );

        res.status(500).json({

            message: "Unable to fetch patients",

            error: error.message

        });

    }

};


// ========================================
// Update Doctor
// ========================================

const updateDoctor = async (req, res) => {

    try {

        const {

            name,
            doctorId,
            specialization,
            password

        } = req.body;


        const updateData = {

            name,
            doctorId,
            specialization

        };


        // Update password only if provided

        if (
            password &&
            password.trim() !== ""
        ) {

            updateData.password =
                await bcrypt.hash(
                    password,
                    10
                );

        }


        const doctor =
            await Doctor.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true
                }

            );


        if (!doctor) {

            return res.status(404).json({

                message:
                    "Doctor not found"

            });

        }


        res.status(200).json({

            message:
                "Doctor Updated Successfully",

            doctor

        });

    }

    catch (error) {

        console.error(
            "Update Doctor Error:",
            error
        );


        res.status(500).json({

            message:
                error.message

        });

    }

};


// ========================================
// Delete Doctor
// ========================================

const deleteDoctor = async (req, res) => {

    try {

        const doctor =
            await Doctor.findByIdAndDelete(

                req.params.id

            );


        if (!doctor) {

            return res.status(404).json({

                message:
                    "Doctor not found"

            });

        }


        res.status(200).json({

            message:
                "Doctor Deleted Successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Doctor Error:",
            error
        );


        res.status(500).json({

            message:
                error.message

        });

    }

};


// ========================================
// Export Controllers
// ========================================

module.exports = {

    registerDoctor,

    loginDoctor,

    getDoctors,

    getPatients,

    updateDoctor,

    deleteDoctor

};