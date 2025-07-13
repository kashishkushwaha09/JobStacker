const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    email:{
        type:String, required:true, unique:true
    },
    password:{
        type:String, required:true
    },
    isRecruiter:{
        type:Boolean, default:false
    }

},{timestamps:true});
module.exports=mongoose.model("User",userSchema);