const { AppError } = require("../utils/appError");

const isApplicant=async(req,res,next)=>{
    try {
        const role=req.user.role;
        if(role!=='applicant'){
            throw new AppError("Only applicants allowed to perform operations",403);
        }
        next();
    } catch (error) {
         if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
    }
}
module.exports=isApplicant;