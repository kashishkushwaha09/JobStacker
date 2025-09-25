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
  isApproved: {
  type: Boolean,
  default: false
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
},
viewedBy: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
views: {
  type: Number,
  default: 0
}
},{timestamps:true});
jobSchema.index({ postedBy: 1 });  
jobSchema.index({ isActive: 1 });  
jobSchema.index({ isApproved: 1 });  
jobSchema.index({ jobType: 1 });  
jobSchema.index({ experienceLevel: 1 });  
jobSchema.index({ isFeatured: -1, updatedAt: -1 });  
jobSchema.index({ _id: 1, postedBy: 1 });            
jobSchema.index({ title: "text", description: "text", location: "text", skillsRequired: "text" }); 

module.exports=mongoose.model("Job",jobSchema);