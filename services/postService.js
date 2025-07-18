const Post=require('../models/postModels');
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

module.exports={
    create
}