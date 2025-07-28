const { AppError } = require("../utils/appError");
const SavedJob=require('../models/savedJobModel');

const saveJob=async(req,res,next)=>{
try {
    const jobId = req.params.jobId;
  const applicantId = req.profile._id;
  const alreadySaved = await SavedJob.findOne({ job: jobId, applicant: applicantId });
  if (alreadySaved)
     throw new AppError("Job already saved",400);
   

  const saved = await SavedJob.create({ job: jobId, applicant: applicantId });
  res.status(201).json({ message: "Job saved", saved });
} catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
}
}
const unsaveJob=async(req,res,next)=>{
try {
    const deleted = await SavedJob.findOneAndDelete({
    job: req.params.jobId,
    applicant: req.profile._id
  });
  res.status(200).json({ message: "Job unsaved", deleted });
} catch (error) {
    console.log(error);
       next(error); 
}
}
const getAllJobs=async(req,res,next)=>{
try {
    const savedJobs = await SavedJob.find({ applicant: req.profile._id }).populate("job");
  res.status(200).json({ savedJobs });
} catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
}
}

module.exports={
    saveJob,unsaveJob,getAllJobs
}