const express=require('express');
const router=express.Router();
const appController=require('../controllers/applicationController');
const authenticateUser=require('../middlewaress/authUser');
const isApplicant=require('../middlewaress/checkApplicant');
const isRecruiter=require('../middlewaress/checkRecruiter');
router.post('/',authenticateUser,isApplicant,appController.applyToJob);
router.get('/',authenticateUser,isApplicant,appController.getMyApplications);
router.get('/job/:jobId',authenticateUser,isRecruiter,appController.getApplicationsByJob);
router.patch('/:id/status',authenticateUser,isRecruiter,appController.updateApplicationStatus);

module.exports=router;