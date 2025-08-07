const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { AppError } = require('../utils/appError');
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const Job=require("../models/jobModel");

const signIn = async (email, password) => {
    try {
       if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // return JWT token
        const token = jwt.sign({ role: "admin" }, process.env.SECRET_KEY, { expiresIn: "4d" });
        await sendEmail(
            email,
            "Welcome Back, Admin 👥 | JobStacker",
            `<h2>Hello Admin 👋</h2>
               <p>You’ve successfully logged into your Admin Dashboard at <strong>JobStacker</strong>.</p>
   <p>From here, you can monitor platform activity, manage users, and keep everything running smoothly.</p>
   <p>Let’s make hiring smarter and faster together!</p>`
        );
        return token;
    }
    return null; 
    } catch (error) {
        throw new AppError(error.message,500);
    }
    
}


const getAllUsers = async (query) => {
  try {
    const {
      role,
      isActive,
      email,
      name,
      location,
      skills,
      companyName,
      hasPremiumAccess,
      search
    } =query;
   let userFilter = {};
    if (role) userFilter.role = role;
    if (email) userFilter.email = { $regex: email, $options: "i" };
    if (isActive !== undefined) userFilter.isActive = isActive === 'true';

    const matchedUsers = await User.find(userFilter).select("_id");
    const userIds = matchedUsers.map(user => user._id);

    if (userIds.length === 0) {
      return {
        total: 0,
        users: [],
      };
    }
let profileQuery = {
  userId: { $in: userIds }
};
if (name) profileQuery.name = { $regex: name, $options: "i" };
if (location) profileQuery.location = { $regex: location, $options: "i" };
if (companyName) profileQuery.companyName = { $regex: companyName, $options: "i" };
if (skills) profileQuery.skills = { $in: [skills] };
if (hasPremiumAccess !== undefined)
  profileQuery.hasPremiumAccess = hasPremiumAccess === 'true';

let searchQuery = {};
if (search) {
  searchQuery = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { headline: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { skills: { $in: [search] } },
      { companyName: { $regex: search, $options: "i" } },
    ]
  };
}

//Combine
const finalQuery = Object.keys(searchQuery).length > 0
  ? { $and: [profileQuery, searchQuery] }
  : profileQuery;
// const skip = (page - 1) * limit;

    const profiles = await Profile.find(finalQuery)
      .populate("userId", "email role isActive")
      // .skip(skip)
      // .limit(Number(limit))
      .sort({ hasPremiumAccess: -1, updatedAt: -1 });

    const total = await Profile.countDocuments(finalQuery);

    return {
        total: total,
        // page,
        // limit,
        users:profiles
      };
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

const getAllJobs=async(query)=>{
  try {
       const {
    // page = 1,
    // limit = 10,
    title,
    location,
    skills,
    isApproved,
    isActive,
    jobType,
    experienceLevel,
    search,
  } =query;
    const filter = {};

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (skills) {
    const skillsArray = skills.split(",").map(s => s.trim());
    filter.skillsRequired = { $in: skillsArray };
  }
   if (isApproved !== undefined) filter.isApproved = isApproved === "true";
  if (isActive !== undefined) filter.isActive = isActive === "true";
  if (jobType) filter.jobType = jobType;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }
  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .populate("postedBy", "name companyName")
    // .skip((page - 1) * limit)
    // .limit(parseInt(limit))
    .sort({ isFeatured: -1, updatedAt: -1 });

    return {
    total,
    // page: parseInt(page),
    // limit: parseInt(limit),
    jobs
  }
  } catch (error) {
    throw new AppError(error.message, 500);
  }
}
module.exports = {
    signIn,getAllUsers,getAllJobs
}