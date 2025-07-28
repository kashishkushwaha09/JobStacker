const express=require('express');
const router=express.Router();
const savedJobController=require('../controllers/savedJobsController');
const authenticateUser=require('../middlewaress/authUser');
const isApplicant=require('../middlewaress/checkApplicant');

router.post("/save/:jobId",authenticateUser,isApplicant,savedJobController.saveJob);
router.delete("/unsave/:jobId",authenticateUser,isApplicant,savedJobController.unsaveJob);
router.get("/", authenticateUser,isApplicant,savedJobController.getAllJobs);

module.exports=router;