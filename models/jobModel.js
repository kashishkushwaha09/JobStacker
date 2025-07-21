const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const jobSchema=new Schema({
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:'Profile',
        required:true
    },
    title:{
        type:String, required:true
    },
    description:{
        type:String, required:true
    },
    salary:{
        type:String, required:true
    },
    location:{
        type:String, required:true
    },
    skillsRequired: {
    type: [String],
    default: []
  },
   isActive: {
    type: Boolean,
    default: true
  }
},{timestamps:true});

module.exports=mongoose.model("Job",jobSchema);