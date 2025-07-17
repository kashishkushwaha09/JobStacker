const { default: mongoose } = require('mongoose');
const Profile = require('../models/profileModel');
const User=require('../models/userModel');
const { AppError } = require('../utils/appError');

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
const getProfile=async(userId,id)=>{
    try {
    const existingProfile=await Profile.findOne({_id:id,userId});

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
    update,deleteProfile,getProfile
}