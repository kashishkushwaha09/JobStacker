const { AppError } = require('../utils/appError');
const Profile=require('../models/profileModel');
const Job=require('../models/jobModel');
// title,description,salary,location
const create=async(fields,userId,role)=>{
try {
    if(role!=='recruiter'){
        throw new AppError("Only recruiters can create job posts", 403);
    }
   const profile=await Profile.findOne({userId});
   fields.postedBy=profile.userId;
   const newJob=new Job(fields);
   await newJob.save();
} catch (error) {
    throw new AppError(error.message,500);
}
}


module.exports={
    create
}