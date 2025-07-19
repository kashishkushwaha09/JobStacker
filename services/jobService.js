const { AppError } = require('../utils/appError');
const Profile=require('../models/profileModel');
const Job=require('../models/jobModel');
const create=async(fields,userId,role)=>{
try {
    if(role!=='recruiter'){
        throw new AppError("Only recruiters can create job posts", 403);
    }
   const profile=await Profile.findOne({userId});
   fields.postedBy=profile._id;
   const newJob=new Job(fields);
   await newJob.save();
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
module.exports={
    create,getAll,getOne
}