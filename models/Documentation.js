const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ["PAN Card", "Passport", "Driver's License", "Other"],
  },
  documentNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
  },
  dob: {
    type: Date,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  verificationErrors: {
    type: [String], // List of validation errors, if any
    default: [],
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the admin who verified the document
    default: null,
  },
  comments: {
    type: String,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

DocumentSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
