const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab"
    },

    tests: [
      {
        type: String
      }
    ],

    status: {
      type: String,
      default: "Pending"
    },

    date: String,

    time: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);