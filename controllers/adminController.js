const adminService=require("../services/adminService");
const User=require("../models/userModel");
const Profile=require("../models/profileModel");
const Job=require('../models/jobModel');
const Application=require('../models/applicationModel');
const SavedJob=require("../models/savedJobModel");
const Orders=require("../models/orderModel");
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
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
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
  const getOneJob=async(req,res,next)=>{
    try {
      const jobId=req.params.id;
      const job = await Job.findById(jobId)
          .populate('postedBy','name companyName companyAbout companyLocation').lean();
        res.status(200).json({message:"Job fetched successfully!",job,success:true});  
    } catch (error) {
      console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Server error while fetching job", 500);
    }
    next(error);
    }
  }
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
// orders
const getPremiumPurchases=async(req,res,next)=>{
  try {
    const { name, email, userType, status } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (userType) filter.userType = userType;
    if (email) filter.email = { $regex: email, $options: "i" };
    const orders = await Orders.find(filter)
       .populate({
        path: "profileId",
        match: name ? { name: { $regex: name, $options: "i" } } : {},
        select: "name location"
      })
      .sort({ createdAt: -1 });
        const finalOrders = name
      ? orders.filter(order => order.profileId)
      : orders;
    res.status(200).json({
      success: true,
      data: finalOrders
    });
  } catch (error) {
    console.error(error);
    if (!(error instanceof AppError)) {
      error = new AppError("Something went wrong", 500);
    }
    next(error);

  }
}
const getAdminStats = async (req, res,next) => {
  try {
    // Total Users (Applicants, Recruiters)
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$role", // 'applicant' or 'recruiter'
          count: { $sum: 1 }
        }
      }
    ]);

    const applicants = userCounts.find(u => u._id === "applicant")?.count || 0;
    const recruiters = userCounts.find(u => u._id === "recruiter")?.count || 0;
    const totalUsers = applicants + recruiters;

    const activeJobs = await Job.countDocuments({
      isActive: true,
      isApproved: true,
      applicationDeadline: { $gt: new Date() }
    });
    const totalApplications = await Application.countDocuments();
    const activeRecruiters = await Job.aggregate([
      { $match: { isActive: true, isApproved: true } },
      {
        $group: {
          _id: "$postedBy", // recruiter id
          jobsPosted: { $sum: 1 }
        }
      },
      { $sort: { jobsPosted: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "_id",
          as: "profile"
        }
      },
      { $unwind: "$profile" },
      {
        $project: {
          _id: 0,
          name: "$profile.name",
          jobsPosted: 1
        }
      }
    ]);

    const activeApplicants = await Application.aggregate([
      {
        $group: {
          _id: "$applicant",
          applications: { $sum: 1 }
        }
      },
      { $sort: { applications: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "_id",
          as: "profile"
        }
      },
      { $unwind: "$profile" },
      {
        $project: {
          _id: 0,
          name: "$profile.name",
          applications: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        applicants,
        recruiters,
        activeJobs,
        totalApplications,
        activeRecruiters,
        activeApplicants
      }
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    if (!(error instanceof AppError)) {
      error = new AppError("Something went wrong", 500);
    }
    next(error);
  }
};
const getAllApplications = async (req, res, next) => {
  try {
    const { status, applicantName, jobTitle } = req.query;

    let filter = {};
    if (status) filter.status = status;
    let query = Application.find(filter)
      .populate({
        path: "job",
        select: "title",
        match: jobTitle
          ? { title: { $regex: jobTitle, $options: "i" } }
          : {},
      })
      .populate({
        path: "applicant",
        select: "name location",
        match: applicantName
          ? { name: { $regex: applicantName, $options: "i" } }
          : {},
      })
      .sort({ createdAt: -1 });

    let applications = await query.exec();

    applications = applications.filter(
      (app) => app.job !== null && app.applicant !== null
    );

    res.json({ success: true, data: applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    next(err);
  }
};
const deleteUserAndProfile=async(req,res,next)=>{
   const userId = req.params.id;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const profile = await Profile.findOne({ userId }).session(session);
     if (profile) {
      await Profile.findByIdAndDelete(profile._id).session(session);
    }
    await User.findByIdAndDelete(userId).session(session);
   
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ success: true, message: 'User and related data deleted.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    next(error);
    
  }
}
module.exports={
  signInUser,
  getAllUsers,
  updateUserStatus,
  getAllJobs,
  getOneJob,
  toggleJobApproval,
  deleteJob,
  getPremiumPurchases,
  getAdminStats,
  getAllApplications,
  deleteUserAndProfile
};