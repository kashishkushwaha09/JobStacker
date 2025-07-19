const { AppError } = require("../utils/appError");
const jobService=require('../services/jobService');

const create=async(req,res,next)=>{
try {
    const {title,description,salary,location}=req.body;
    const userId=req.user._id;
    const role=req.user.role;
    const job=await jobService.create({title,description,salary,location},userId,role);
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
    const jobs=await jobService.getAll();
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
     const job=await jobService.getOne(jobId);
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
    const userId=req.user._id;
     const jobs=await jobService.getJobsPostedByUser(userId);
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
    const {title,description,salary,location}=req.body;
    const userId=req.user._id;
    const role=req.user.role;
    const jobId=req.params.id;
    const job=await jobService.update({title,description,salary,location},jobId,userId,role);
    res.status(200).json({message:"Job updated successfully!",job,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
// const deleteJob=async(req,res,next)=>{

// }
// const searchJobs=async(req,res,next)=>{

// }
module.exports={
   create,getAll,getOneJob,getJobsPostedByUser,update,
//    deleteJob,searchJobs
}