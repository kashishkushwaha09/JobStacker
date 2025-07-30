const { AppError } = require("../utils/appError");
const jobService=require('../services/jobService');

 const parseSkills = (skills) => {
    
      if (Array.isArray(skills)) {
    return skills.map(s => s.trim()).filter(Boolean);
  }
            if (typeof skills === 'string' && skills.trim()) {
                try {
                    const parsed = JSON.parse(skills);
                    return Array.isArray(parsed) ? parsed.map(s => s.trim()).filter(Boolean) : [];
                } catch {
                    return skills.split(',').map(s => s.trim()).filter(Boolean)
                }
            }
            return [];
        }
const create=async(req,res,next)=>{
try {
    const {title,description,salary,location,skillsRequired, jobType,
      experienceLevel,
      applicationDeadline,
      openings}=req.body;
    const profileId=req.profile._id;
    const parsedSkills = parseSkills(skillsRequired);
   
    const jobFields = {
      title,
      description,
      salary,
      location,
      skillsRequired: parsedSkills,
      jobType,
      experienceLevel,
      applicationDeadline,
      openings
    };
    if (applicationDeadline) {
  jobFields.applicationDeadline = new Date(applicationDeadline);
}

    const job=await jobService.create(jobFields,profileId);
    res.status(201).json({message:"Job created successfully!",job,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const getAll=async(req,res,next)=>{
try {
    const profileId=req.profile._id;
    const jobs=await jobService.getAll(profileId);
    res.status(200).json({message:"Jobs fetched successfully!",jobs,success:true});
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const getOneJob=async(req,res,next)=>{
try {
    const jobId=req.params.id;
    const user=req.user;
    const profileId=req.profile._id;
     const job=await jobService.getOne(jobId,user,profileId);
    res.status(200).json({message:"Job fetched successfully!",job,success:true});
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const getJobsPostedByUser=async(req,res,next)=>{
try {
    const profileId=req.profile._id;
     const jobs=await jobService.getJobsPostedByUser(profileId);
    res.status(200).json({message:"Job fetched successfully!",jobs,success:true});
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const update=async(req,res,next)=>{
try {
    const {title,description,salary,location,skillsRequired,jobType,
      experienceLevel,
      applicationDeadline,
      openings}=req.body;
    const profileId=req.profile._id;
    const jobId=req.params.id;
    const parsedSkills = parseSkills(skillsRequired);
     const updatedFields = {
      title,
      description,
      salary,
      location,
      skillsRequired: parsedSkills,
      jobType,
      experienceLevel,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      openings
    };
      Object.keys(updatedFields).forEach((key) => {
      if (updatedFields[key] === undefined || updatedFields[key] === null) {
        delete updatedFields[key];
      }
    });
    const job=await jobService.update(updatedFields,jobId,profileId);
    res.status(200).json({message:"Job updated successfully!",job,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const changeStatus=async(req,res,next)=>{
    try {
    const profileId=req.profile._id;
    const jobId=req.params.id;
    const job=await jobService.changeStatus(jobId,profileId);
    res.status(200).json({message:`Job is now ${job.isActive ? "active" : "closed"}`,job,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}

const deleteJob=async(req,res,next)=>{
try {
    const profileId=req.profile._id;
    const jobId=req.params.id;
    const deletedJob=await jobService.deleteJob(jobId,profileId);
    res.status(200).json({message:"Job deleted successfully!",deletedJob,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
// const searchJobs=async(req,res,next)=>{

// }
const getJobInsights = async (req, res,next) => {
  try {
    const jobId = req.params.jobId;
    const jobInsights=await jobService.getJobInsights(jobId);
    return res.status(200).json({
      success: true,
      jobInsights
    });

  } catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
  }
};
module.exports={
   create,getAll,getOneJob,getJobsPostedByUser,update,changeStatus,deleteJob,getJobInsights
//    searchJobs
}