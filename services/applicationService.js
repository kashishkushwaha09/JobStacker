const { AppError } = require("../utils/appError");
const Application=require('../models/applicationModel');
const jobService=require('../services/jobService');
const Job=require("../models/jobModel");
const getInsights=async(applicantId)=>{
  try {
    const applications = await Application.find({ applicant: applicantId });
    if(!applications){
      throw new AppError("Applications not found",404);
    }
        const insights = {
          total: applications.length,
          accepted: 0,
          rejected: 0,
          pending: 0,
        };
    
        applications.forEach(app => {
          insights[app.status] = (insights[app.status] || 0) + 1;
        });
    return insights;
  } catch (error) {
     if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
  }
}
const apply=async(jobId,profile,user)=>{
try {
    const job=await jobService.getOne(jobId,user,profile._id);
    if (!job.isActive|| new Date() > new Date(job.applicationDeadline)) {
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
   if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
const getMyApplications=async(profileId)=>{
    try {
        const applications=await Application.find({ applicant: profileId })
      .populate('job', 'title location')
      .sort('-createdAt');
      return applications;
    } catch (error) {
      throw new AppError(error.message,500);
    }
}
const getApplicationsByJob=async(jobId,profileId)=>{
    try {
        const job=await Job.findById(jobId);
    if (job.postedBy._id.toString() !== profileId.toString()) {
      throw new AppError("Unauthorized access", 403);
    }

    const applications = await Application.find({ job: jobId })
    .populate({
    path: 'applicant',
    select: 'name headline location userId hasPremiumAccess',
    populate: {
      path: 'userId',
      select: 'email'
    }
  }).sort({ 'applicant.hasPremiumAccess': -1, createdAt: 1,matchScore: -1  });
      if(!applications) throw new AppError("applications not found",404);
     return applications;
    } catch (error) {
         if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
    }
}
const updateApplicationStatus=async(appId,profileId,status)=>{
    try {
         if (!["accepted", "rejected","pending"].includes(status)) {
      throw new AppError("Invalid status", 400);
    }

    const application = await Application.findById(appId).populate('job');
    if (!application) throw new AppError("Application not found", 404);

    const job = application.job;
    if (job.postedBy.toString() !== profileId.toString()) {
      throw new AppError("Not authorized to update this application", 403);
    }

    application.status = status;
    await application.save();

    } catch (error) {
         if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
    }
}
module.exports={
    getInsights,apply,getMyApplications,getApplicationsByJob,updateApplicationStatus
}