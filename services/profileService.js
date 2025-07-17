const Profile = require('../models/profileModel');
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

module.exports={
    update,
}