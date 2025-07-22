const { AppError } = require("../utils/appError");
const {uploadToCloudinary}=require('../config/cloudinary');
const profileService=require('../services/profileService');
const updateProfileApplicant = async (req, res, next) => {
    try {
        const { name, headline, about, location, skills, experience, education, projects } = req.body;
        // profilePicture & resumeUrl from multer
        const updatedFields = {};
        if (typeof name === 'string' && name.trim()) updatedFields.name = name.trim();
        if (typeof headline === 'string' && headline.trim()) updatedFields.headline = headline.trim();
        if (typeof about === 'string' && about.trim()) updatedFields.about = about.trim();
        if (typeof location === 'string' && location.trim()) updatedFields.location = location.trim();
        const parseSkills = (skills) => {
            if (typeof skills === 'string' && skills.trim()) {
                try {
                    const parsed = JSON.parse(skills);
                    return Array.isArray(parsed) ? parsed.map(s => s.trim()).filter(Boolean) : [];
                } catch {
                    return skills.split(',').map(s => s.trim()).filter(Boolean)
                }
            }
            return [];
        }
        const parsedSkills = parseSkills(skills);
        if (parsedSkills.length > 0) updatedFields.skills = parsedSkills;
        if (experience && typeof experience === 'string' && experience.trim()) {
            const parsed = JSON.parse(experience);
            if (Array.isArray(parsed)) {
                parsed.forEach(exp => {
                    if (!exp.jobTitle || !exp.companyName || !exp.startDate || !exp.endDate || !exp.location || !exp.description) {
                        throw new AppError("Required all experience fields",400);
                    }
                })
                updatedFields.experience = parsed;
            }
            
        }
        if (education && typeof education === 'string' && education.trim()) {
            const parsed = JSON.parse(education);
            if (Array.isArray(parsed)) {
                parsed.forEach(ed => {
                    if (!ed.schoolName ||!ed.degree|| !ed.fieldOfStudy||!ed.startYear||!ed.endYear||!ed.description) {
                        throw new AppError("Required all education fields",400);
                    }
                })
                updatedFields.education = parsed;
            }
            
        }
        if(projects && typeof projects==='string' && projects.trim()){
            const parsed=JSON.parse(projects);
            if(Array.isArray(parsed)){
                parsed.forEach(p=>{
                if(!p.title || !p.description ||!p.projectUrl ||!p.githubLink){
                   throw new AppError("Required all education fields",400); 
                }
                if(!Array.isArray(p.techStack) || p.techStack.length===0){
                    throw new AppError("techStack must be a non-empty array",400); 
                }
                })
                updatedFields.projects = parsed;
            }
             
        }
        if(req.files){
            const profileFile = req.files.profilePicture?.[0];
            const resumeFile = req.files.resume?.[0];
            if (profileFile) {
    const profileDataUri = `data:${profileFile.mimetype};base64,${profileFile.buffer.toString('base64')}`;
    const profileUpload = await uploadToCloudinary(profileDataUri, 'image');
    updatedFields.profilePicture = profileUpload.result.secure_url;
  }

  if (resumeFile) {
    const resumeDataUri = `data:${resumeFile.mimetype};base64,${resumeFile.buffer.toString('base64')}`;
    const resumeUpload = await uploadToCloudinary(resumeDataUri, 'raw');
    updatedFields.resumeUrl = resumeUpload.rawfileUrl;
  }
        }
     const profile=await profileService.update(updatedFields,req.user._id);
     res.status(200).json({message:"Profile Updated successfully",profile,success:true});
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const updateProfileRecruiter = async (req, res, next) => {
    try {
        const { name, headline, about, location, companyName, companyAbout, companyLocation } = req.body;
        // profilePicture from multer
          const updatedFields = {};
        if (typeof name === 'string' && name.trim()) updatedFields.name = name.trim();
        if (typeof headline === 'string' && headline.trim()) updatedFields.headline = headline.trim();
        if (typeof about === 'string' && about.trim()) updatedFields.about = about.trim();
        if (typeof location === 'string' && location.trim()) updatedFields.location = location.trim();
        if (typeof companyName === 'string' && companyName.trim()) updatedFields.companyName = companyName.trim();
        if (typeof companyAbout === 'string' && companyAbout.trim()) updatedFields.companyAbout = companyAbout.trim();
        if (typeof companyLocation === 'string' && companyLocation.trim()) updatedFields.companyLocation = companyLocation.trim();

         if(req.file){
            const profileFile = req.file;
            const profileDataUri=`data:${profileFile.mimetype};base64,${profileFile.buffer.toString('base64')}`;
            const profileUpload=await uploadToCloudinary(profileDataUri,'image');
            updatedFields.profilePicture=profileUpload.result.secure_url;
        }
     const profile=await profileService.update(updatedFields,req.user._id);
     res.status(200).json({message:"Profile Updated successfully",profile,success:true});
    } catch (error) {
        console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
    }
}
const deleteProfile=async (req,res,next)=>{
    try {
        const userId=req.user._id;
        const message =await profileService.deleteProfile(userId);
        res.status(200).json({message:message,success:true});
    } catch (error) {
        console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
    }
}
const getProfile=async (req,res,next)=>{
      try {
        const userId=req.user._id;
        const id=req.params.id;
        const profile =await profileService.getProfile(userId,id);
        res.status(200).json({message:'profile fetched',profile,success:true});
    } catch (error) {
        console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
    }
}
const myProfile=async (req,res,next)=>{
      try {
        const userId=req.user._id;
        const profileId=req.profile._id;
        const profile =await profileService.myProfile(userId,profileId);
        res.status(200).json({message:'profile fetched',profile,success:true});
    } catch (error) {
        console.log(error);
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        next(error);
    }
}
module.exports = {
    updateProfileApplicant, updateProfileRecruiter,deleteProfile,getProfile,myProfile
}