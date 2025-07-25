const applicationService=require('../services/applicationService');
const { AppError } = require('../utils/appError');


const applyToJob=async(req,res,next)=>{
try {
    const jobId=req.body.jobId;
    const profile=req.profile;
    const application=await applicationService.apply(jobId,profile);
    res.status(201).json({message:"Applied to job successfully!",application,success:true});
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
}
}
// For applicants to see their job applications.
const getMyApplications = async (req, res, next) => {
  try {
    const profileId = req.profile._id;
    const applications = await applicationService.getMyApplications(profileId);  
    res.json({ success: true, applications });
  } catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
  }
};
// For recruiters to see applications for a specific job.
const getApplicationsByJob = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const profileId = req.profile._id;
    const applications=await applicationService.getApplicationsByJob(jobId,profileId);

    res.json({ success: true, applications });
  } catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appId = req.params.id;
    const profileId = req.profile._id;
    const application=await applicationService.updateApplicationStatus(appId,profileId,status);
    res.json({ success: true, message: `Application ${status}`, application });
  } catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
  }
};


module.exports={applyToJob,getMyApplications,getApplicationsByJob,updateApplicationStatus};