const Lab = require("../models/Lab");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ============================
// Generate JWT Token
// ============================

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

// ============================
// Register New Lab
// ============================

const registerLab = async (req, res) => {

  try {

    const {

      labName,

      location,

      labId,

      password

    } = req.body;

    // Check if Lab already exists

    const existingLab = await Lab.findOne({

      labId

    });

    if (existingLab) {

      return res.status(400).json({

        message: "Lab already exists"

      });

    }

    // Hash Password

    const hashedPassword = await bcrypt.hash(

      password,

      10

    );

    // Create Lab

    const lab = await Lab.create({

      labName,

      location,

      labId,

      password: hashedPassword

    });

    res.status(201).json({

      message: "Lab Added Successfully",

      lab

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// ============================
// Lab Login
// ============================

const loginLab = async (req, res) => {

  try {

    const {

      labId,

      password

    } = req.body;

    const lab = await Lab.findOne({

      labId

    });

    if (!lab) {

      return res.status(404).json({

        message: "Lab not found"

      });

    }

    const isMatch = await bcrypt.compare(

      password,

      lab.password

    );

    if (!isMatch) {

      return res.status(400).json({

        message: "Invalid Password"

      });

    }

    res.json({

      message: "Lab Login Successful",

      token: generateToken(

        lab._id,

        "lab"

      ),

      lab: {

        id: lab._id,

        labId: lab.labId,

        labName: lab.labName,

        location: lab.location,

        tests: lab.tests

      }

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// ============================
// Get All Labs
// ============================

const getAllLabs = async (req, res) => {

  try {

    const labs = await Lab.find();

    res.json(labs);

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};

// ============================
// Export
// ============================

module.exports = {

  registerLab,

  loginLab,

  getAllLabs

};