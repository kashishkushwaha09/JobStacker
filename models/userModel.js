const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String, required:true, unique:true
    },
    password:{
        type:String, required:true
    },
    role:{
        type:String,enum:['applicant','recruiter','admin'],default:'applicant'
    }

},{timestamps:true});
module.exports=mongoose.model("User",userSchema);