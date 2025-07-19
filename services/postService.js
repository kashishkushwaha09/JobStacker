const Post=require('../models/postModels');
const Profile=require('../models/profileModel');
const { AppError } = require('../utils/appError');

const create=async(fields)=>{
try {
    const newPost=new Post(fields);
    await newPost.save();
    return newPost;
} catch (error) {
    throw new AppError(error.message,500);
}
}
const edit=async(fields)=>{
  try {
   const post=await Post.findById(fields.postId);
   if(!post){
    throw new AppError("Post not found",404);
   }
   if(post.userId.toString()!==fields.userId.toString()){
    throw new AppError("Unauthorized to edit this post", 403);
   }
   if(fields.imageUrl) post.imageUrl=fields.imageUrl;
   if(fields.content) post.content=fields.content;
   await post.save();
   return post;
} catch (error) {
    if(!(error instanceof AppError)){
                error=new AppError(error.message,500);
            }
            throw error; 
}  
}
const deletePost=async(postId,userId)=>{
   try {
   const post=await Post.findOneAndDelete({_id:postId,userId});
    if (!post) {
      throw new AppError("Post not found or you're not authorized to delete it", 404);
    }

   return post;
} catch (error) {
    if(!(error instanceof AppError)){
                error=new AppError(error.message,500);
            }
            throw error; 
}  
}
const getAll=async()=>{
    try {
    const posts=await Post.find().populate('userId','email').sort({updatedAt:-1}).lean();
    for(let post of posts){
     const profile=await Profile.findOne({userId:post.userId._id}).select('name profilePicture');
     post.userName=profile?.name;
     post.userPicture=profile?.profilePicture;
    }
    return posts;
} catch (error) {
    throw new AppError(error.message,500);
}
}
const getOne=async(postId)=>{
      try {
    const post=await Post.findById(postId).populate('userId','email').lean();
    if (!post) {
      throw new AppError("Post not found", 404);
    }
     const profile=await Profile.findOne({userId:post.userId._id}).select('name profilePicture');
     post.userName=profile?.name;
     post.userPicture=profile?.profilePicture;
  
    return post;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
const toggleLike=async(postId,userId)=>{
       try {
    const post=await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    const index=post.likes.findIndex(id=> id.toString()===userId.toString());
    if (index === -1) {
  post.likes.push(userId);
}else{
post.likes.splice(index, 1);
}
await post.save();
    return post;
} catch (error) {
    if(!(error instanceof AppError)){
                error=new AppError(error.message,500);
            }
            throw error; 
}
}
const addComment=async(postId,userId,text)=>{
    try {
    const post=await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }
   post.comments.push({
    userId,text
   })
await post.save();
    return post;
} catch (error) {
    if(!(error instanceof AppError)){
                error=new AppError(error.message,500);
            }
            throw error; 
}
}
const deleteComment=async(postId,userId,commentId)=>{
     try {
    const post=await Post.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    const comment = post.comments.id(commentId);
    if (!comment) {
      throw new AppError("Comment not found", 404);
    }
    if(comment.userId.toString()!==userId.toString()){
    throw new AppError("Unauthorized to delete this comment", 403);
    }
   post.comments.pull(commentId);
await post.save();
    return post;
} catch (error) {
    if(!(error instanceof AppError)){
            error=new AppError(error.message,500);
        }
        throw error; 
}
}
module.exports={
    create,edit,getAll,getOne,toggleLike,addComment,deleteComment,deletePost
}