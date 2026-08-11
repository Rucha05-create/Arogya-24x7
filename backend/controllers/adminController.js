const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const loginAdmin = async (req, res) => {

  try {

    const {
      adminId,
      password
    } = req.body;

    const admin = await Admin.findOne({
      adminId
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    console.log("Request Body:", req.body);
    console.log("Admin ID:", adminId);
    console.log("Entered Password:", password);
    console.log("Stored Hash:", admin.password);

    const isMatch = await bcrypt.compare(
     password,
     admin.password
    );

console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    res.json({

  message: "Admin Login Successful",

  token: generateToken(
    admin._id,
    "admin"
  ),

  user: {

    adminId: admin.adminId,

    role: "admin"

  }

});

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {
  loginAdmin
};