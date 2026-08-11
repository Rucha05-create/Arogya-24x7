const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    labId: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    labName: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    tests: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Lab", labSchema);