const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  value: { type: String, required: true },
  lastUpdated: { type: Date, required: true, default: Date.now },
});

const LeadSchema = new mongoose.Schema(
  {
    linkedInUrl: FieldSchema,
    firstName: FieldSchema,
    lastName: FieldSchema,
    email: FieldSchema,
    firstPhone: FieldSchema,
    title: FieldSchema,
    jobTitle: FieldSchema,
    seniority: FieldSchema,
    departments: FieldSchema,
    workPhone: FieldSchema,
    homePhone: FieldSchema,
    mobilePhone: FieldSchema,
    otherPhone: FieldSchema,
    city: FieldSchema,
    state: FieldSchema,
    country: FieldSchema,
    facebook: FieldSchema,
    twitter: FieldSchema,
    pastCompanies: FieldSchema,
    // Add other company fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
