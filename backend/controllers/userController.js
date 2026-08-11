const User = require("../models/User");


// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        console.error("Get Users Error:", error);

        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });

    }

};


// ==========================================
// UPDATE USER PROFILE
// ==========================================

const updateUser = async (req, res) => {

    try {

        const {
            phone,
            bloodGroup,
            height,
            weight,
            address,
            allergies,
            diseases,
            medications,
            emergencyContact
        } = req.body;


        // ==========================================
        // FIND AND UPDATE USER
        // ==========================================

        const user = await User.findByIdAndUpdate(

            req.params.id,

            {
                phone,
                bloodGroup,
                height,
                weight,
                address,
                allergies,
                diseases,
                medications,
                emergencyContact
            },

            {
                new: true,
                runValidators: true
            }

        );


        // ==========================================
        // USER NOT FOUND
        // ==========================================

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        res.status(200).json({

            message: "Profile updated successfully",

            user

        });


    } catch (error) {

        console.error(
            "Update User Error:",
            error
        );

        res.status(500).json({

            message: "Failed to update profile",

            error: error.message

        });

    }

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getAllUsers,

    updateUser

};