const { AppError } = require('../utils/appError');
const Job=require('../models/jobModel');
const create=async(fields,profileId)=>{
try {
   fields.postedBy=profileId;
   const newJob=new Job(fields);
   await newJob.save();
} catch (error) {
    throw new AppError(error.message,500);
}
}
const update=async(fields,jobId,profileId)=>{
try {
   const existedJob=await Job.findOne({_id:jobId,postedBy:profileId});
   if (!existedJob) {
      throw new AppError("Job not found or unauthorized", 404);
    }
    const { title, description, salary, location,skillsRequired,jobType,
      experienceLevel,
      applicationDeadline,
      openings,} = fields;
 if (typeof title === 'string' && title.trim()) {
      existedJob.title = title.trim();
    }

    if (typeof description === 'string' && description.trim()) {
      existedJob.description = description.trim();
    }

    if (typeof salary === 'string' && salary.trim()) {
      existedJob.salary = salary.trim();
    }

    if (typeof location === 'string' && location.trim()) {
      existedJob.location = location.trim();
    }
     if(Array.isArray(skillsRequired) && skillsRequired.length>0){
      existedJob.skillsRequired=skillsRequired;
     }
      if (typeof jobType === 'string' && jobType.trim()) {
      existedJob.jobType = jobType.trim();
    }

    if (typeof experienceLevel === 'string' && experienceLevel.trim()) {
      existedJob.experienceLevel = experienceLevel.trim();
    }

    if (applicationDeadline) {
      existedJob.applicationDeadline = new Date(applicationDeadline);
    }

    if (!isNaN(openings)) {
      existedJob.openings = openings;
    }
   await existedJob.save();
   return existedJob;
} catch (error) {
    throw new AppError(error.message,500);
}
}
const deleteJob=async(jobId,profileId)=>{
    try {
       const deletedJob=await Job.findOneAndDelete({_id:jobId,postedBy:profileId});
       if (!deletedJob) {
      throw new AppError("Job not found or you're not authorized to delete it", 404);
    }

    return deletedJob; 
    } catch (error) {
      throw new AppError(error.message,500);  
    }
}
const getAll=async()=>{
    try {
   const jobs=await Job.find().populate('postedBy','name companyName companyAbout companyLocation').sort({updatedAt:-1}).lean();
   return jobs;
} catch (error) {
    throw new AppError(error.message,500);
}
}
const getOne=async(jobId)=>{
  try {
   const job=await Job.findById(jobId).populate('postedBy','name companyName companyAbout companyLocation').lean();
   if (!job) {
  throw new AppError("Job not found", 404);
}
   return job;
} catch (error) {
    throw new AppError(error.message,500);
}
}
const getJobsPostedByUser=async(profileId)=>{
    try {
   const jobs=await Job.find({postedBy:profileId}).populate('postedBy','name companyName companyAbout companyLocation').lean();
   if (!jobs) {
  throw new AppError("Jobs not found", 404);
}
   return jobs;
} catch (error) {
    throw new AppError(error.message,500);
} 
}
const changeStatus=async(status,jobId,profileId)=>{
 try {
  const {isActive}=status;
   const job=await Job.findOneAndUpdate(
   { _id:jobId, postedBy:profileId },
  {isActive},
  { new: true }
   );
   if (!job) {
  throw new AppError("Jobs not found", 404);
}
   return job;
} catch (error) {
    throw new AppError(error.message,500);
} 
}
module.exports={
    create,update,deleteJob,getAll,getOne,getJobsPostedByUser,changeStatus
}