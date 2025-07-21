const applicationService=require('../services/applicationService');
const { AppError } = require('../utils/appError');



// See their applications
// Recruiters can:

// See all applications for a specific job

// Update application status
// Apply to a job

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
module.exports={applyToJob};