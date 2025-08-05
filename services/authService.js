const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail=require('../utils/sendEmail');
const User = require('../models/userModel');
const Profile = require('../models/profileModel');
const { AppError } = require('../utils/appError');

const findByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
}
const signUp = async (name, email, password, role) => {
    try {
        const existingUser = await findByEmail(email);
        if (existingUser) {
            throw new AppError("User already exists", 409);
        }
       const hashPassword=await bcrypt.hash(password,13);
       const newUser=new User({
        email,password:hashPassword,role
       })
       await newUser.save();
       const userId=newUser._id;
       if(userId){
        const newProfile=new Profile({
        userId,name:name
       });
       await newProfile.save();
         // Send Welcome Email Based on Role
      if (role === "recruiter") {
        await sendEmail(
          email,
          "Welcome to JobStacker, Recruiter 👥",
          `<h2>Hello ${name} 👋</h2>
           <p>You're now part of the JobStacker recruiting community.</p>
           <p>Start posting jobs and finding amazing talent today!</p>`
        );
      } else {
        await sendEmail(
          email,
          "Welcome to JobStacker 👋",
          `<h2>Hello ${name} 👋</h2>
           <p>Thanks for signing up!</p>
           <p>Explore job opportunities and grow your career now!</p>`
        );
      }
       const secret=process.env.SECRET_KEY;
       console.log("Secret key ",secret);
        const token=jwt.sign(
        {userId,email},
        secret,
        {expiresIn:'7d'}
       )
       return token;
       }
      
    } catch (error) {
       if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
    }
}
const signIn=async(email,password)=>{
try {
    const existingUser = await findByEmail(email);
        if (!existingUser) {
            throw new AppError("User not found!", 404);
        }
         if (!existingUser.isActive) {
            throw new AppError("Your account is deactivated. Contact support.", 403);
    }
        const isPasswordMatched=await bcrypt.compare(password,existingUser.password);
        if(!isPasswordMatched){
            throw new AppError('Invalid Password',400);
        }
        await sendEmail(
  existingUser.email,
  "New Login to Your JobStacker Account 👀",
  `<p>Hi ${existingUser.name || "User"},</p>
   <p>Your account was just accessed on ${new Date().toLocaleString()}.</p>
   <p>If this wasn’t you, please reset your password immediately.</p>`
);
        const token=jwt.sign(
            {userId:existingUser._id,email:existingUser.email},
            process.env.SECRET_KEY,
            {expiresIn:'7d'}
        );
        return {token,userId:existingUser._id,role:existingUser.role};
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
module.exports={
    signUp,signIn
}