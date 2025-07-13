const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const profileSchema=new Schema({
userId:{type:Schema.Types.ObjectId,ref:"User", required:true},
//common fields for both recruiter and applicant
name:{type:String,required:true},
headline:String,
about:String,
location:String,
profilePicture:String,
// Applicant-specific fields
resumeUrl:String,
skills:[String],
experience:[
    {
      jobTitle: String,
      companyName: String,
      startDate: Date,
      endDate: Date,
      location: String,
      description: String,
    }
],
education:[
    {
      schoolName: String,
      degree: String,
      fieldOfStudy: String,
      startYear: Number,
      endYear: Number,
      description: String,
    }
],
projects: [
    {
      title: String,
      description: String,
      techStack: [String],
      projectUrl: String,
      githubLink: String
    }
  ],
  // Recruiter-specific fields
  companyName:String,
  companyAbout:String,
  companyLocation:String,
},{timestamps:true});
module.exports=mongoose.model("Profile",profileSchema);