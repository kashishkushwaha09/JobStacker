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

applicationSchema.index({ job: 1 });
applicationSchema.index({ job: 1, applicant: 1 },{unique:true});
applicationSchema.index({ job: 1, "applicant.hasPremiumAccess": -1, createdAt: 1, matchScore: -1 });

module.exports = mongoose.model("Application", applicationSchema);