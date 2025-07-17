const authService=require('../services/authService');

const { AppError } = require('../utils/appError');
const signUpUser=async(req,res,next)=>{
   
    try {
        const {name,email,password,role}=req.body;
        const token=await authService.signUp(name,email,password,role);
        if(!token){
            throw new AppError("Something Went Wrong!",500);
        }
        return res.status(201).json({
            message:"User Created Successfully!",
            token
        })
    } catch (error) {
        console.log(error);
        if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        next(error);
    }
}
const signInUser=async(req,res,next)=>{
    try {
         const {email,password}=req.body;
        const userObj=await authService.signIn(email,password);
        if(!userObj.token){
            throw new AppError("Something Went Wrong!",500);
        }
        return res.status(200).json({
            message:"User logged in Successfully!",
            token:userObj.token,
            userId:userObj.userId      
        })
    } catch (error) {
        console.log(error);
        if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        next(error); 
    }
}

module.exports={
    signUpUser,signInUser
}