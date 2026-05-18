const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: [
        "Product Designer",
        "Product Manager",
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "UI/UX Designer",
        "QA Engineer",
        "DevOps Engineer",
        "Data Analyst",
        "Project Manager",
      ],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    teams: [
      {
        type: String,
        enum: [
          "Design",
          "Product",
          "Marketing",
          "Technology",
          "Finance",
          "HR",
          "Operations",
        ],
      },
    ],
    avatar: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    nationality: {
      type: String,
      default: "",
    },
    contactNo: {
      type: String,
      default: "",
    },
    workEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
