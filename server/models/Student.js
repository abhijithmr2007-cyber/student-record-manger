const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
      validate: {
        validator: Number.isInteger,
        message: "Semester must be a whole number from 1 to 8.",
      },
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Student", studentSchema);
