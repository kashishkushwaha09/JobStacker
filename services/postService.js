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
    throw new AppError(error.message,500);
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
    throw new AppError(error.message,500);
}
}
module.exports={
    create,getAll,getOne,toggleLike
}