// models/ProfileView.js
const mongoose = require('mongoose');

const profileViewSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});
profileViewSchema.index({ applicantId: 1, recruiterId: 1 }, { unique: true });

module.exports = mongoose.model('ProfileView', profileViewSchema);
