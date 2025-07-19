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
const update=async(fields,jobId,userId,role)=>{
try {
    if(role!=='recruiter'){
        throw new AppError("Only recruiters can update job posts", 403);
    }
   const profile=await Profile.findOne({userId});
   const existedJob=await Job.findOne({_id:jobId,postedBy:profile._id});
if(typeof fields.title==='string' && fields.title.trim()){
    existedJob.title=fields.title.trim();
}
if(typeof fields.description==='string' && fields.description.trim()){
    existedJob.description=fields.description.trim();
}
if(typeof fields.salary==='string' && fields.salary.trim()){
    existedJob.salary=fields.salary.trim();
}
if(typeof fields.location==='string' && fields.location.trim()){
    existedJob.location=fields.location.trim();
}

   await existedJob.save();
   return existedJob;
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
const getJobsPostedByUser=async(userId)=>{
    try {
   const profile=await Profile.findOne({userId});
   const jobs=await Job.find({postedBy:profile._id}).populate('postedBy','name companyName companyAbout companyLocation').lean();
   if (!jobs) {
  throw new AppError("Jobs not found", 404);
}
   return jobs;
} catch (error) {
    throw new AppError(error.message,500);
} 
}
module.exports={
    create,update,getAll,getOne,getJobsPostedByUser
}