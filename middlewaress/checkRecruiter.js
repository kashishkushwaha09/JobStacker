const { AppError } = require("../utils/appError");



const isRecruiter=async(req,res,next)=>{
    try {
        const role=req.user.role;
        if(role!=='recruiter'){
            throw new AppError("Only Recruiter allowed to perform operations",403);
        }
        next();
    } catch (error) {
         if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
    }
}
module.exports=isRecruiter;