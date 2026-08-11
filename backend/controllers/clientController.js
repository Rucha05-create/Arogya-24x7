const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =========================
// Generate JWT Token
// =========================

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

// =========================
// Client Register
// =========================

const registerClient = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
      age,
      gender,
      bloodGroup,
      height,
      weight,
      allergies,
      diseases,
      medications,
      emergencyContact,
      address
    } = req.body;

    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({

        name,

        email,

        password:
          hashedPassword,

        phone,

        age,

        gender,

        bloodGroup,

        height,

        weight,

        allergies,

        diseases,

        medications,

        emergencyContact,

        address,

        role: "client"

      });

    res.status(201).json({

      message:
        "Registration Successful",

      token:
        generateToken(
          user._id,
          user.role
        ),

      user

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

// =========================
// Client Login
// =========================

const loginClient = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {

      return res.status(404).json({
        message:
          "User not found"
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid Password"
      });

    }

    res.json({

      message:
        "Login Successful",

      token:
        generateToken(
          user._id,
          user.role
        ),

      user

    });

  }

  catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {

  registerClient,

  loginClient

};