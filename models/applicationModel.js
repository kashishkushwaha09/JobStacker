const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    matchedSkills: {
        type: [String],
        default: []
    },
    missingSkills: {
        type: [String],
        default: []
    },
     matchScore: {
    type: Number,
    default: 0
  },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    recruiterViewedProfile: {
  type: Boolean,
  default: false,
},

resumeDownloaded: {
  type: Boolean,
  default: false,
},
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);