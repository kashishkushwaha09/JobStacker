const { AppError } = require("../utils/appError");
const uploadToCloudinary=require('../config/cloudinary');
const fs = require("fs");
const path = require("path");
const profileService=require('../services/profileService');
const resumeDownload=async(req,res,next)=>{
     try {
    const { profileId } = req.params;
    console.log("profileId",profileId);
   const {resumePath,cleanName}=await profileService.resumeDownload(profileId);
   console.log(resumePath);
    res.download(resumePath,cleanName);
  } catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
  }
}
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
    const profileUrl = await uploadToCloudinary(
      profileFile.buffer,
      "user_uploads/images",
      profileFile.originalname
    );
    updatedFields.profilePicture=profileUrl;
  }

 if (resumeFile) {
   const fileType = resumeFile.mimetype;
   if (fileType === "application/pdf") {
    const timestamp = Date.now();
const fileName = `${timestamp}_${resumeFile.originalname}`;
      const uploadPath = path.join(__dirname, "../uploads/pdfs");
      const filePath = path.join(uploadPath, fileName);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  // Delete old resume
        const existingProfile = await profileService.findById(req.profile._id);
        if (existingProfile.resumeUrl) {
            const oldFilePath = path.join(__dirname, "..", existingProfile.resumeUrl);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
      fs.writeFileSync(filePath, resumeFile.buffer);
      const url = `/uploads/pdfs/${fileName}`;
       updatedFields.resumeUrl=url;

    } else {
        throw new AppError("Unsupported file type",400);
    }
    
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
            const profileUrl =await uploadToCloudinary(
      profileFile.buffer,
      "user_uploads/images",
      profileFile.originalname
    );
    
    updatedFields.profilePicture =profileUrl;
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
        const applicantId =req.params.id;
        const viewerId = req.profile._id; 
        const profile =await profileService.getProfile(applicantId,viewerId);
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
    resumeDownload,updateProfileApplicant, updateProfileRecruiter,deleteProfile,getProfile,myProfile
}