const { AppError } = require("../utils/appError");
const Application=require('../models/applicationModel');
const jobService=require('../services/jobService');
const apply=async(jobId,profile)=>{
try {
    const job=await jobService.getOne(jobId);
    if (!job.isActive) {
  throw new AppError("This job is no longer accepting applications", 400);
}
    const jobSkills = job.skillsRequired.map(skill => skill.toLowerCase());
    const userSkills = profile.skills.map(skill => skill.toLowerCase());
    const matchedSkills=jobSkills.filter(skill=>userSkills.includes(skill));
    const missingSkills=jobSkills.filter(skill=>!userSkills.includes(skill));
    if(matchedSkills.length<2){
    throw new AppError("Require at least 2 matching skills to apply for this job",400);
    }
    const matchScore=Math.round((matchedSkills.length/jobSkills.length)*100);
    const existedApp=await Application.findOne({job:jobId,applicant:profile._id});
    if(existedApp){
        throw new AppError("You have already applied to this job",409);
    }
    const newApplication=new Application({job:jobId,applicant:profile._id,matchedSkills,missingSkills,matchScore});
    await newApplication.save();
    return newApplication;
} catch (error) {
   throw new AppError(error.message,500); 
}
}

module.exports={
    apply
}