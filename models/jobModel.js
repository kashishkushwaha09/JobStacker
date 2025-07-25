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
  },
   jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Remote', 'Contract'],
    default: 'Full-Time'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior'],
    default: 'Fresher'
  },
  applicationDeadline: {
    type: Date 
  },
   openings: {
    type: Number,
    default: 1
  },
  isFeatured: {
  type: Boolean,
  default: false,
}
},{timestamps:true});

module.exports=mongoose.model("Job",jobSchema);