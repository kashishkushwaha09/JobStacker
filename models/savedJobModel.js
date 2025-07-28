const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model("SavedJob", savedJobSchema);
