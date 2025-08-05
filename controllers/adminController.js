const adminService=require("../services/adminService");
const User=require("../models/userModel");
const Profile=require("../models/profileModel");
const Job=require('../models/jobModel');
const Application=require('../models/applicationModel');
const SavedJob=require("../models/savedJobModel");
const { AppError } = require("../utils/appError");
const { default: mongoose } = require("mongoose");
const signInUser=async(req,res,next)=>{
    try {
         const {email,password}=req.body;
        const token=await adminService.signIn(email,password);
        if(!token){
            throw new AppError("Something Went Wrong!",500);
        }
        return res.status(200).json({
            message:"Admin logged in Successfully!",
            token,
            role:"admin"   
        })
    } catch (error) {
        console.log(error);
        if(!(error instanceof AppError)){
            error=new AppError("Invalid credentials",401);
        }
        next(error); 
    }
}
const getAllUsers = async (req, res, next) => {
  try {
   const result=await adminService.getAllUsers(req.query);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Server error while fetching users", 500);
    }
    next(error);
  }
};
const updateUserStatus = async (req, res,next) => {
  try {
    const { id } = req.params;

    // Find current user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Toggle the isActive field
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
      success:true
    });
  } catch (error) {
    console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Server error while fetching users", 500);
    }
    next(error);
  }
};
// jobs
  const getAllJobs=async(req,res,next)=>{
    try {
      const {
    page = 1,
    limit = 10,
    title,
    location,
    skills,
    isApproved,
    isActive,
    jobType,
    experienceLevel,
    search,
  } = req.query;
  const result=await adminService.getAllJobs(req.query);
    res.json(result);
    } catch (error) {
      console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Server error while fetching jobs", 500);
    }
    next(error);
    }
  };
const toggleJobApproval=async(req,res,next)=>{
try {
  const jobId = req.params.id;
    const { isApproved } = req.body;

    if (typeof isApproved !== 'boolean') {
      throw new AppError("`isApproved` must be a boolean (true or false).",400)
    }
    const job = await Job.findById(jobId);
    if (!job) {
      throw new AppError("Job not found.",404)
    }

    job.isApproved = isApproved;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job has been ${isApproved ? "approved" : "disapproved"}.`,
      job,
    });
} catch (error) {
  console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Something went wrong", 500);
    }
    next(error);
}
}
const deleteJob=async(req,res,next)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
     const jobId = req.params.id;
      const deletedJob = await Job.findByIdAndDelete(jobId, { session });
    if (!deletedJob) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError("Job not found.",404);
    }
    await Application.deleteMany({ jobId }, { session });
    await SavedJob.deleteMany({ jobId }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Job and all related data deleted successfully.",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Something went wrong", 500);
    }
    next(error);
  }
}
module.exports={signInUser,getAllUsers,updateUserStatus,getAllJobs,toggleJobApproval,deleteJob};