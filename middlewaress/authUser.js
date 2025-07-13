const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
const { AppError } = require('../utils/appError');

const authenticateUser=async (req,res,next)=>{
    const authHeader=req.header.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
     throw new AppError("Unauthorized",401);
    }
    try {
        const token=authHeader.split(' ')[1];
        const decode=jwt.verify(token,process.env.SECRET_KEY);
        const userId=decode.userId;
        if(!userId){
           throw new AppError("Unauthorized",401); 
        }
        const user = await User.findById(decode.userId);
        if(!user){
           throw new AppError("User not found",404);  
        }
        req.user = user;
        next();
    } catch (error) {
        if(!(error instanceof AppError)){
            error=new AppError('Invalid Token',403);
        }
        next(error);
    }
}
module.exports=authenticateUser;