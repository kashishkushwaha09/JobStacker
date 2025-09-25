const Job = require('../models/jobModel');

const deactivateExpiredJobs = async () => {
  const now = new Date();
  const expiredJobs = await Job.updateMany(
    { applicationDeadline: { $lt: now }, isActive: true },
    { $set: { isActive: false } }
  );
  console.log(`Deactivated ${expiredJobs.modifiedCount} expired jobs`);
};

module.exports=deactivateExpiredJobs;
