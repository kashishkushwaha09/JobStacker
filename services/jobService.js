const { AppError } = require('../utils/appError');
const Job=require('../models/jobModel');
const Application=require('../models/applicationModel');
const Profile=require('../models/profileModel');
const SavedJob=require('../models/savedJobModel');
const create=async(fields,profileId)=>{
try {
  const profile = await Profile.findById(profileId);
   fields.postedBy=profile._id;
   fields.isFeatured=profile.hasPremiumAccess === true;
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
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
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
       console.log(error);
          if (!(error instanceof AppError)) {
              error = new AppError(error.message, 500);
          }
          throw error;
    }
}
const getAll=async(profileId,query)=>{
    try {
      const {
    title,
    location,
    skills,
    isApproved,
    isActive,
    jobType,
    experienceLevel,
    search,
  } =query;
    const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (skills) {
  const skillsArray = skills
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  filter.skillsRequired = {
    $in: skillsArray.map(skill => new RegExp(`^${escapeRegex(skill)}$`, "i"))
  };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
   if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
      .populate("postedBy", "name companyName companyAbout companyLocation")
      // .skip((page - 1) * limit)
      // .limit(parseInt(limit))
      .sort({ isFeatured: -1, updatedAt: -1 }).lean();
  
   const savedJobs = await SavedJob.find({ applicant: profileId }).select("job");
   const savedJobIds = new Set(savedJobs.map((sj) => sj.job.toString()));
    const jobsWithSaveStatus = jobs.map((job) => ({
      ...job,
      isSaved: savedJobIds.has(job._id.toString())
    }));
     return {
      total,
      // page: parseInt(page),
      // limit: parseInt(limit),
      jobs:jobsWithSaveStatus
    }
   
} catch (error) {
    throw new AppError(error.message,500);
}
}
const getOne=async(jobId,user,profileId)=>{
  try {
   const job=await Job.findById(jobId);
  //  .populate('postedBy','name companyName companyAbout companyLocation').lean();
   if (!job) {
  throw new AppError("Job not found", 404);
}
console.log("user",user);
if (user.role === "applicant" && !job.viewedBy.includes(profileId)) {
    job.views += 1;
    job.viewedBy.push(profileId);
    await job.save();
  }
 const populatedJob = await Job.findById(jobId)
    .populate('postedBy','name companyName companyAbout companyLocation').lean();

   return populatedJob;
} catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
       throw error;
}
}
const getJobsPostedByUser=async(profileId,query)=>{
    try {
      const {
    title,
    location,
    skills,
    isApproved,
    isActive,
    jobType,
    experienceLevel,
    search,
  } =query;
    const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (skills) {
  const skillsArray = skills
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  filter.skillsRequired = {
    $in: skillsArray.map(skill => new RegExp(`^${escapeRegex(skill)}$`, "i"))
  };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
   if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  filter.postedBy=profileId;
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
      .populate("postedBy", "name companyName companyAbout companyLocation")
      // .skip((page - 1) * limit)
      // .limit(parseInt(limit))
      .sort({ isFeatured: -1, updatedAt: -1 });
  
      return {
      total,
      // page: parseInt(page),
      // limit: parseInt(limit),
      jobs
    }
} catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
} 
}
const changeStatus=async(jobId,profileId)=>{
 try {

   const job=await Job.findOne(
   { _id:jobId, postedBy:profileId });
   if (!job) {
  throw new AppError("Jobs not found", 404);
}
 job.isActive = !job.isActive;
    await job.save();
   return job;
} catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
       throw error;
} 
}
const getJobInsights=async(jobId)=>{
  try {
     const job = await Job.findById(jobId).lean();
      if (!job) throw new AppError("Job not found",404);
      const views = job.views || 0;
      const totalApplications = await Application.countDocuments({ job: jobId });
      const premiumApplications = await Application.find({ job: jobId }).populate("applicant", "hasPremiumAccess");
    const premiumCount = premiumApplications.filter(app => app.applicant?.hasPremiumAccess).length;

    const postedAt = new Date(job.createdAt);
    const options = {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
};
const formattedPostedAt = postedAt.toLocaleString('en-IN', options);
  
    return {
       title: job.title,
        views,
        totalApplications,
        premiumCount,
        timeSincePosted:formattedPostedAt
    }
  } catch (error) {
     console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
  }
}
module.exports={
    create,update,deleteJob,getAll,getOne,getJobsPostedByUser,changeStatus,getJobInsights
}