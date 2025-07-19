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
// const getAll=async(req,res,next)=>{

// }
// const getOneJob=async(req,res,next)=>{

// }
// const getJobsPostedByUser=async(req,res,next)=>{

// }
// const update=async(req,res,next)=>{

// }
// const deleteJob=async(req,res,next)=>{

// }
// const searchJobs=async(req,res,next)=>{

// }
module.exports={
   create,
//    getAll,getOneJob,getJobsPostedByUser,update,deleteJob,searchJobs
}