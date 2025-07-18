const { AppError } = require("../utils/appError");
const {uploadToCloudinary}=require('../config/cloudinary');
const postService=require("../services/postService");

const createPost=async(req,res,next)=>{
try {
    const {content}=req.body;
    const userId=req.user._id;
   
    let imageUrl;
    if(req.file){
        const imageFile = req.file;
        const imageDataUri=`data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
        const imageUpload=await uploadToCloudinary(imageDataUri,'image');
        imageUrl=imageUpload.result.secure_url;
    }
    const fields={};
    fields.userId=userId;
    if (typeof content === 'string' && content.trim()) fields.content = content.trim();
    if (typeof imageUrl === 'string' && imageUrl.trim()) fields.imageUrl = imageUrl.trim();
    const post=await postService.create(fields);
    res.status(201).json({message:"Post created successfully",post,success:true});

} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}

const allPost=async(req,res,next)=>{

}
const getOnePost=async(req,res,next)=>{

}

const toggleLike=async(req,res,next)=>{

}
const addComment=async(req,res,next)=>{

}
const deleteComment=async(req,res,next)=>{

}

const editPost=async(req,res,next)=>{

}
const deletePost=async(req,res,next)=>{

}



module.exports = {
    createPost,allPost,getOnePost,toggleLike,addComment,deleteComment,editPost,deletePost
}