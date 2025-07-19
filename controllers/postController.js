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
try {
    const posts=await postService.getAll();
    if(!posts) throw new AppError("Something went wrong",500);
    res.status(200).json({message:"Posts fetched successfully",posts,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const getOnePost=async(req,res,next)=>{
try {
    const id=req.params.id;
    const post=await postService.getOne(id);
    if(!post) throw new AppError("Something went wrong",500);
    res.status(200).json({message:"Post fetched successfully",post,success:true});
} catch (error) {
     console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}

const toggleLike=async(req,res,next)=>{
try {
    const userId=req.user._id;
    const postId = req.params.postId;
    const updatedPost=await postService.toggleLike(postId,userId);
    res.status(200).json({message:"Like toggled successfully",likesCount: updatedPost.likes.length,success: true})
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
}
}
const addComment=async(req,res,next)=>{
try {
    const userId=req.user._id;
    const postId = req.params.postId;
    const text=req.body.text;
    const updatedPost=await postService.addComment(postId,userId,text);
    res.status(200).json({message:"Comment added successfully",commentsCount: updatedPost.comments.length,success: true})
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
}
}
const deleteComment=async(req,res,next)=>{
try {
    const userId=req.user._id;
    const postId = req.params.postId;
    const commentId=req.params.commentId;
    const updatedPost=await postService.deleteComment(postId,userId,commentId);
    res.status(200).json({message:"Comment deleted successfully",commentsCount: updatedPost.comments.length,success: true})
} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error); 
}
}

const editPost=async(req,res,next)=>{
try {
    const {content}=req.body;
    const postId = req.params.postId;
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
    fields.postId=postId;
    if (typeof content === 'string' && content.trim()) fields.content = content.trim();
    if (typeof imageUrl === 'string' && imageUrl.trim()) fields.imageUrl = imageUrl.trim();
    const post=await postService.edit(fields);
    res.status(200).json({message:"Post updated successfully",post,success:true});

} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}
const deletePost=async(req,res,next)=>{
try {
    const postId = req.params.postId;
    const userId=req.user._id;
   
    const post=await postService.deletePost(postId,userId);
    res.status(200).json({message:"Post deleted successfully",post,success:true});

} catch (error) {
    console.log(error);
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    next(error);
}
}



module.exports = {
    createPost,allPost,getOnePost,toggleLike,addComment,deleteComment,editPost,deletePost
}