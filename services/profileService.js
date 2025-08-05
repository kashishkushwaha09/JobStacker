const { default: mongoose } = require('mongoose');
const Profile = require('../models/profileModel');
const fs = require('fs');
const path = require('path');
const User=require('../models/userModel');
const ProfileView=require('../models/profileViewModel');
const { AppError } = require('../utils/appError');
const resumeDownload=async(profileId)=>{
  try {
    const profile = await Profile.findById(profileId);
   
      if (!profile || !profile.resumeUrl) {
        throw new AppError("Resume not found", 404);
      }
  
      const resumePath = path.join(__dirname, "..", profile.resumeUrl);
       const filename = path.basename(profile.resumeUrl); // e.g. 1753676846953_degree.pdf
    const cleanName = filename.split("_").slice(1).join("_"); // degree.pdf
      if (!fs.existsSync(resumePath)) {
        throw new AppError("Resume file missing", 404);
      }
  
      profile.resumeDownloadCount = (profile.resumeDownloadCount || 0) + 1;
      await profile.save();
      return {resumePath,cleanName};
  } catch (error) {
     if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error;  
  }
}
const findById=async(id)=>{
  try {
     const existingProfile=await Profile.findById(id);

if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }
    return existingProfile;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error;    
  }
}
const update=async(updatedFields,userId)=>{
try {
    const existingProfile=await Profile.findOneAndUpdate({userId},updatedFields,{new:true});

if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }
    return existingProfile;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
const deleteProfile=async(userId)=>{
    const session=await mongoose.startSession();
   session.startTransaction();
try {
    await Profile.findOneAndDelete({userId},{session});
    const deletedUser =  await User.findByIdAndDelete(userId,{session});
    if(!deletedUser){
        throw new AppError("User not found", 404);
    }
    await session.commitTransaction();
    session.endSession();
    return {message:"Account and profile deleted successfully"}
} catch (error) {
    session.abortTransaction();
    session.endSession();
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
// userId,applicantId,viewerId
const getProfile=async(applicantId,viewerId)=>{
    try {
    const existingProfile=await Profile.findOne({_id:applicantId});

if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }
     const alreadyViewed = await ProfileView.findOne({
        applicantId,
        recruiterId: viewerId
      });

      if (!alreadyViewed) {
        
        await Profile.findByIdAndUpdate(applicantId, {
          $inc: { profileViewCount: 1 }
        });
        await ProfileView.create({
          applicantId,
          recruiterId: viewerId
        });
      }
    
    return existingProfile;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
const getProfileForAdmin=async(id)=>{
     try {
    const existingProfile=await Profile.findById(id);

if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }
    return existingProfile;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
const myProfile=async(userId,profileId)=>{
      try {
    const existingProfile=await Profile.findOne({_id:profileId,userId});

if (!existingProfile) {
      throw new AppError('Profile not found', 404);
    }
    return existingProfile;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
module.exports={
    resumeDownload,update,deleteProfile,getProfile,myProfile,findById,getProfileForAdmin
}