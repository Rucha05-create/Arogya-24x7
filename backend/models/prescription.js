const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment"
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    diagnosis: String,

    medicines: String,

    notes: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);